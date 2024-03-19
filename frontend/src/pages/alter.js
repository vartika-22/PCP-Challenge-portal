import React from "react";
import Leaderboard from "./Leaderboard";

const StatisticsCards = () => {
  return (
    <div className="grey-bg container-fluid">
      <section id="minimal-statistics">
        <div className="d-flex flex-row">
          {" "}
          {/* Use flex classes to create a flex container */}
          <div className="col-xl-3 col-sm-6 col-12 slide-in">
            <div className="card">
              <div className="card-content">
                <div className="card-body">
                  <div className="media d-flex">
                    <div className="align-self-center"></div>

                    <div className="media-body text-right">
                      <h2>JavaScript</h2>

                      <span>The programming language for the web.</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-xl-3 col-sm-6 col-12 slide-in">
            <div className="card">
              <div className="card-content">
                <div className="card-body">
                  <div className="media d-flex">
                    <div className="align-self-center"></div>

                    <div className="media-body text-right">
                      <h2>CSS</h2>

                      <span>Styling the web with cascading stylesheets</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-xl-3 col-sm-6 col-12 slide-in">
            <div className="card">
              <div className="card-content">
                <div className="card-body">
                  <div className="media d-flex">
                    <div className="align-self-center"></div>

                    <div className="media-body text-right">
                      <h2>HTML</h2>

                      <span>Markup language for building web pages</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-xl-3 col-sm-6 col-12 slide-in">
            <div className="card">
              <div className="card-content">
                <div className="card-body">
                  <div className="media d-flex">
                    <div className="align-self-center"></div>

                    <div className="media-body text-right">
                      <h2>React</h2>

                      <span>
                        A JavaScript library for building UI components
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <Leaderboard></Leaderboard>
    </div>
  );
};

export default StatisticsCards;
