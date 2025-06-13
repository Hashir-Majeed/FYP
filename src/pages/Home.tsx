import { useNavigate } from "react-router-dom";
import css from "./Home.module.css";
import Layout from "../components/Layout";

const SCHOOLS = [
  { id: 1, name: "King's College School Wimbledon" },
  { id: 2, name: "West Kirby Grammar School" },
  { id: 3, name: "Wycombe Abbey School" }
];

function Home() {
  const navigate = useNavigate();

  const handleNotionalAppClick = () => {
    // Show school selection modal or navigate to school selection page
    navigate('/school-selection');
  };

  return (
    <Layout>
      <div className={css.tutorialBannerWrapper}>
        <div className={css.tutorialBanner}>
          <p className={css.tutorialBannerTitle}>
             Welcome to the Ontological Unified Education Platform!
          </p>
          <p>
            Choose your situation below to get started.
          </p>
        </div>
      </div>
      
      <div className={css.buttonContainer}>
        <button 
          className={css.appButton}
          onClick={handleNotionalAppClick}
        >
          Notional App
        </button>
        <button 
          className={css.appButton}
          onClick={() => navigate('/kcs-wimbledon')}
        >
          KCS Wimbledon Deployed App
        </button>
        <button 
          className={css.appButton}
          onClick={() => navigate('/tool-evaluation')}
        >
          Evaluation Suite
        </button>
      </div>
    </Layout>
  );
}

export default Home;
