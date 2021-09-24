import React, { useEffect, useRef, useState } from "react";
import { withTranslation } from "react-i18next";
import NavigateBeforeIcon from "@material-ui/icons/NavigateBefore";
import { useHistory } from "react-router-dom";
import { Star } from "@material-ui/icons";
import { Hidden } from "@material-ui/core";
import { Popover, ArrowContainer } from "react-tiny-popover";

// Custom components
import { AlignCenter } from "components/general";
import ProgressBar from "components/features/ProgressBar";
import Mainlogo from "assets/sakerhetskontrollen-logo.svg";
import StyledLink from "components/general/StyledLink";
import { QUESTIONS } from "util/constants";
import { getMaxScore, getStoredTotalAmount } from "util/totalScore";

const Header = ({
  t,
  currentQuestionIndex,
  totalQuestions,
  isFinished,
  starAmount,
}) => {
  return (
    <div>
      <AlignCenter marginTop={false}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",

            width: "100%",
            padding: "8px 0",
          }}
        >
          {currentQuestionIndex === 0 ? (
            <ContentBeforeStart />
          ) : (
            <ContentAfterStart
              t={t}
              isFinished={isFinished}
              currentQuestionIndex={currentQuestionIndex}
              totalQuestions={totalQuestions}
              starAmount={starAmount}
            />
          )}
        </div>
      </AlignCenter>
      {currentQuestionIndex !== 0 && isFinished === false ? (
        <ProgressBar
          currentQuestionIndex={currentQuestionIndex}
          totalQuestions={totalQuestions}
        />
      ) : null}
    </div>
  );
};

const ContentBeforeStart = () => (
  <div style={{ display: "flex", justifyContent: "center", width: "100%" }}>
    <div>
      <p
        style={{
          fontSize: "0.8em",
          display: "block",
          width: "100%",
          margin: 0,
        }}
      >
        I samarbete med
      </p>
      <StyledLink
        href="https://www.digitalungdom.se/"
        colored
        style={{
          fontSize: "0.9em",
          display: "block",
          width: "100%",
          margin: 0,
        }}
      >
        Digital Ungdom
      </StyledLink>
    </div>
  </div>
);

const ContentAfterStart = ({
  t,
  currentQuestionIndex,
  totalQuestions,
  starAmount,
  isFinished,
}) => {
  const history = useHistory();

  let questionsLeft = "";
  if (isFinished === true) {
    questionsLeft = t("general.done") + "!";
  } else if (totalQuestions - currentQuestionIndex + 1 === 1) {
    questionsLeft = t("general.questionLeft");
  } else {
    questionsLeft = t("general.questionsLeft");
  }

  return (
    <>
      {/*TODO: Implement auto-resume. When user clicks 'Return to Start' and then clicks 'Start' again, the quiz resumes from last answered question.*/}
      <div style={{ display: "flex" }}>
        <div
          style={{ lineHeight: 1, cursor: "pointer", paddingRight: 12 }}
          onClick={() => {
            history.push("/");
          }}
        >
          <p
            style={{
              fontSize: "0.6em",
              display: "block",
              width: "100%",
              margin: 0,
            }}
          >
            Tillbaks till
          </p>
          <p
            style={{
              fontSize: "0.8em",
              display: "block",
              width: "100%",
              margin: 0,
              fontWeight: "bold",
            }}
          >
            <NavigateBeforeIcon
              style={{
                height: 20,
                margin: "-2px -2px -5px -8px",
              }}
            />
            Start
          </p>
        </div>
        <StarContainer
          starAmount={starAmount}
          totalQuestions={totalQuestions}
        />
      </div>

      <Hidden xsDown>
        <div
          style={{
            width: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            left: 0,
            top: 6,
            position: "absolute",
            pointerEvents: "none",
          }}
        >
          <img
            style={{
              width: 110,
              position: "relative",
              height: "auto",
            }}
            alt="Säkerhetskontrollen"
            src={Mainlogo}
          />
        </div>
      </Hidden>

      <div
        style={{
          display: "flex",
          lineHeight: 1,
          flexWrap: "nowrap",
          alignItems: "center",
        }}
      >
        <p
          style={{
            fontSize: "1.1em",
            display: "inline-block",
            margin: 5,
            fontWeight: "bold",
            opacity: isFinished ? 0 : 1,
          }}
        >
          {totalQuestions - currentQuestionIndex + 1}
        </p>
        <p
          style={{
            fontSize: "0.6em",
            display: "block",
            width: 5,
            margin: "0 20px 0 0",
          }}
        >
          {questionsLeft}
        </p>
      </div>
    </>
  );
};

let prevStarAmount = 0;

const StarContainer = ({ starAmount, totalQuestions }) => {
  // Star values
  const [scale, setScale] = useState(1);
  const [left, setLeft] = useState(window.innerWidth / 2);
  const [top, setTop] = useState("40vh");
  const [opacity, setOpacity] = useState(0);
  const [transition, setTransition] = useState("");
  const [starAmountText, setStarAmountText] = useState(0);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const clickMeButtonRef = useRef();

  function showStar() {
    setTransition(
      "opacity 0.5s ease, transform 0.5s cubic-bezier(.16,.98,.36,1.6)"
    );
    setScale(3);
    setOpacity(1);
    setLeft(window.innerWidth / 2 - 16);
    setTop("40vh");

    setTimeout(function () {
      setTransition("all 1s ease-in-out");
      const starAmountIcon = document.getElementById("starAmountIcon");
      const starAmountIconRect = starAmountIcon.getBoundingClientRect();

      setScale(1);
      setOpacity(0);
      setLeft(starAmountIconRect.left);
      setTop(starAmountIconRect.top);
      setStarAmountText(starAmount);
    }, 800);
  }

  useEffect(() => {
    if (starAmount > prevStarAmount) {
      prevStarAmount = starAmount;
      showStar();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [starAmount]);

  return (
    <>
      <Popover
        isOpen={isPopoverOpen}
        positions={["bottom"]}
        padding={10}
        onClickOutside={() => setIsPopoverOpen(false)}
        ref={clickMeButtonRef} // if you'd like a ref to your popover's child, you can grab one here
        content={({ position, childRect, popoverRect }) => (
          <ArrowContainer
            position={position}
            childRect={childRect}
            popoverRect={popoverRect}
            arrowColor={"white"}
            arrowSize={6}
            className="popover-arrow-container"
            arrowClassName="popover-arrow"
          >
            <div
              style={{
                background: "white",
                display: "flex",
                borderRadius: 8,
                padding: 8,
              }}
              onClick={() => setIsPopoverOpen(!isPopoverOpen)}
            >
              <StarBox amount={starAmount} totalAmount={totalQuestions} />
              <StarBox
                amount={getStoredTotalAmount()}
                totalAmount={getMaxScore()}
                total
              />
            </div>
          </ArrowContainer>
        )}
      >
        <div
          onClick={() => setIsPopoverOpen(!isPopoverOpen)}
          style={{
            background: "rgba(255,255,255,0.1)",
            borderRadius: 6,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: 4,
            cursor: "pointer",
          }}
        >
          <Star id="starAmountIcon" style={{ color: "yellow" }} />
          <p style={{ margin: "0 2px" }}>{starAmountText}</p>
        </div>
      </Popover>
      <div
        id="animatedStar"
        style={{
          transform: "scale(" + scale + ") ",
          position: "absolute",
          left: left,
          top: top,
          opacity: opacity,
          transition: transition,
          zIndex: 100,
          pointerEvents: "none",
        }}
      >
        <Star style={{ color: "yellow" }} />
      </div>
    </>
  );
};

const StarBox = ({ amount, totalAmount, total = false }) => {
  return (
    <div
      style={{
        margin: total === true ? "0 0 0 4px" : "0 4px 0 0",
        textAlign: "center",
      }}
    >
      <div
        style={{
          background: total ? "silver" : "gold",
          borderRadius: 4,
          width: 80,
          height: 80,
          color: "black",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
            height: "100%",
          }}
        >
          <Star style={{ color: "yellow" }} />
          <p style={{ margin: 0, fontSize: "0.9em" }}>
            <span style={{ fontWeight: 600, fontSize: "1.1em" }}>{amount}</span>
            /<span style={{ fontWeight: 300 }}>{totalAmount}</span>
          </p>
        </div>
      </div>
      <p
        style={{
          margin: "4px 0 0 0",
          fontSize: "0.8em",
          fontWeight: 600,
          color: total ? "grey" : "black",
        }}
      >
        {total ? "Totalt" : "Detta quiz"}
      </p>
    </div>
  );
};

export default withTranslation("common")(Header);
