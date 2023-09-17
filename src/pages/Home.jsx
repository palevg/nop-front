import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="home">
      <h1>Реєстр недержавних охоронних підприємств</h1>
      <div className="home__items">
        <Link className="home__item" to="/enterprs">Юридичні особи</Link>
        <Link className="home__item" to="/peoples">Фізичні особи (засновники, керівники, персонал охорони)</Link>
      </div>
    </div>
  )
}

export default Home;