
import Popoyoko from "./assets/Popoyoko.png";
import Storybook from "./assets/storybook.svg";
import "./App.css";

function App() {
  return (
    <>
        <a href="https://github.com/Popoyoko" target="_blank">
          <img src={Popoyoko} className="logo" alt="Popoyoko logo" />
        </a>
          <h1>Popoyoko Boilerplate</h1>
      <a href="https://popoyoko.github.io/popoyoko-ui/" target="_blank">
          <img src={Storybook} className="features" alt="Storybook logo" />
        </a>
      <p className="read-the-docs">Click on the Popoyoko logos to learn more</p>
    </>
  );
}

export default App;
