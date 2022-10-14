import { ButtonApp } from "./ui/ButtonApp";
import Slider from "react-input-slider";
import { InputBlock } from "./InputBlock";
import { useEffect, useState } from "react";
import useDebounce from "../hooks/useDebounce";
import { minMaxValidator } from "../validator/validator";
import { instance } from "../API/instance";
import preloader from "../assets/img/preloader.svg";

export const Calc = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [summ, setSumm] = useState(Number(3300000).toLocaleString("ru-RU"));
  const [initPayment, setInitPayment] = useState(13);
  const [term, setTerm] = useState(60);
  const [initSumm, setInitSumm] = useState(
    Number(
      (parseInt(`${summ}`.replace(/[^\d]/g, ""), 10) / 100) * initPayment
    ).toLocaleString("ru-RU")
  );
  const [monthPay, setMonthPay] = useState(
    Math.round(
      (+summ.replace(/[^\d]/g, "") - +initSumm.replace(/[^\d]/g, "")) *
        ((0.035 * Math.pow(1 + 0.035, term)) / (Math.pow(1 + 0.035, term) - 1))
    )
  );
  const [lizingSumm, setLizingSumm] = useState(
    monthPay * term + +initSumm.replace(/[^\d]/g, "")
  );

  useEffect(() => {
    setInitSumm(
      Number(
        (parseInt(`${summ}`.replace(/[^\d]/g, ""), 10) / 100) * initPayment
      ).toLocaleString("ru-RU")
    );

    setMonthPay(
      Math.round(
        (+summ.replace(/[^\d]/g, "") - +initSumm.replace(/[^\d]/g, "")) *
          ((0.035 * Math.pow(1 + 0.035, term)) /
            (Math.pow(1 + 0.035, term) - 1))
      )
    );

    setLizingSumm(monthPay * term + +initSumm.replace(/[^\d]/g, ""));
  });
  const data = {
    car_coast: +summ.replace(/[^\d]/g, ""),
    initail_payment: +initSumm.replace(/[^\d]/g, ""),
    initail_payment_percent: initPayment,
    lease_term: term,
    total_sum: lizingSumm,
    monthly_payment_from: monthPay,
  };

  const sliderStyles = {
    track: {
      height: 2,
      backgroundColor: "#E1E1E1",
    },
    active: {
      backgroundColor: "#FF9514",
    },
    thumb: {
      width: 16,
      height: 16,
      backgroundColor: "#FF9514",
      "&:hover": {
        transform: "scale(1.2)",
      },
    },
    disabled: {
      opacity: 0.5,
    },
  };

  const validSumm = (el) => {
    setSumm(minMaxValidator(el));
  };
  const validInitPay = (el) => {
    setInitPayment(minMaxValidator(el));
  };
  const validTerm = (el) => {
    setTerm(minMaxValidator(el));
  };
  const debounceSumm = useDebounce(validSumm, 500);
  const debounceInitPay = useDebounce(validInitPay, 500);
  const debounceTerm = useDebounce(validTerm, 500);

  const onSubmit = (data) => {
    setIsLoading(true);
    instance
      .post(``, {
        data,
      })
      .catch(function (error) {
        console.log(error);
        setIsLoading(false);
      })
      .then((response) => {
        console.log(response);
        setIsLoading(false);
      });
  };
  return (
    <div className="calc">
      <h1 className="title">Рассчитайте стоимость автомобиля в лизинг</h1>
      <form>
        <div className="calc__wrapper ">
          <div className="calc__item">
            <InputBlock
              type="text"
              id="summ"
              name="car_coast"
              label="Стоимость автомобиля"
              value={summ}
              minval={1000000}
              maxval={6000000}
              onChange={(e) => {
                setSumm(e.target.value.replace(/[^\d]/g, ""), 10);
                debounceSumm(e.target);
              }}
              disabled={isLoading}
            >
              <Slider
                className="input-block__range"
                axis="x"
                styles={sliderStyles}
                xmax={6000000}
                xmin={1000000}
                xstep={100000}
                x={parseInt(summ.replace(/[^\d]/g, ""), 10)}
                onChange={({ x }) => setSumm(Number(x).toLocaleString("ru-RU"))}
                disabled={isLoading}
              />
              <div className="input-block__unit">₽</div>
            </InputBlock>
          </div>
          <div className="calc__item">
            <InputBlock
              name="initail_payment"
              type="text"
              forid="init_payment"
              label="Первоначальный взнос"
              value={initSumm}
              readOnly
            >
              <Slider
                className="input-block__range"
                axis="x"
                styles={sliderStyles}
                xmin={10}
                xmax={60}
                x={initPayment}
                onChange={({ x }) => {
                  setInitPayment(x);
                }}
                disabled={isLoading}
              />
              <div className="input-block__unit">
                <input
                  id="init_payment"
                  type="text"
                  name="initail_payment_percent"
                  value={`${initPayment}`}
                  className=" input-block__unit_field"
                  minval={10}
                  maxval={60}
                  onChange={(e) => {
                    setInitPayment(e.target.value.replace(/[^\d]/g, ""), 10);
                    debounceInitPay(e.target);
                  }}
                  disabled={isLoading}
                />
                <span>%</span>
              </div>
            </InputBlock>
          </div>
          <div className="calc__item">
            <InputBlock
              type="text"
              name="lease_term"
              id="term"
              label="Срок лизинга"
              value={term}
              minval={1}
              maxval={60}
              onChange={(e) => {
                setTerm(e.target.value.replace(/[^\d]/g, ""), 10);
                debounceTerm(e.target);
              }}
              disabled={isLoading}
            >
              <Slider
                className="input-block__range"
                axis="x"
                styles={sliderStyles}
                xmin={1}
                xmax={60}
                x={term}
                onChange={({ x }) => setTerm(x)}
                disabled={isLoading}
              />
              <div className="input-block__unit">мес.</div>
            </InputBlock>
          </div>
        </div>
        <div className="calc__wrapper calc__footer">
          <div className="calc__item">
            <div className="calc__label">Сумма договора лизинга</div>
            <div className="calc__val">
              {`${Number(lizingSumm).toLocaleString()}₽`}
            </div>
            <input hidden name="total_summ" value={Number(lizingSumm)} />
          </div>
          <div className="calc__item">
            <div className="calc__label">Ежемесячный платеж от</div>
            <div className="calc__val">{`${Number(
              monthPay
            ).toLocaleString()}₽`}</div>
            <input
              hidden
              name="monthly_payment_from"
              value={Number(monthPay)}
            />
          </div>
          <div className="calc__item">
            <ButtonApp
              onClick={(e) => {
                e.preventDefault();
                onSubmit(data);
              }}
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="btn-preloader">
                  <img src={preloader} alt="preload" />
                </span>
              ) : (
                "Оставить заявку"
              )}
            </ButtonApp>
          </div>
        </div>
      </form>
    </div>
  );
};
