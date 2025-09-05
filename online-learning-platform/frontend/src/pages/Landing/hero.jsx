import { Link } from "react-router-dom";
import Button from "../../components/ui/button";

const Hero = () => {
  return (
    <div className="flex container px-8 mx-auto xl:px-0">
      <div className="flex items-center px-10 w-full lg:w-1/2">
        <div className="max-w-2xl mb-8">
          <h1 className="text-4xl font-bold leading-snug tracking-tight text-gray-800 lg:text-4xl lg:leading-tight xl:text-6xl xl:leading-tight">
            Welcome to Online Learning Platform
          </h1>
          <p className="py-5 text-xl leading-normal text-gray-500 lg:text-xl xl:text-2xl">
            Online Learning Platform is your all-in-one solution for managing courses and
            departments. With our platform, you can easily create, manage, and
            enroll in courses, and stay organized with departmental information.
            It's built with React.js, Tailwind CSS, Node.js, and MongoDB
            providing a modern and efficient user experience.
          </p>

          <div>
            <Link to={"/courses"}>
              <Button style={"py-5 px-10 text-xl"}>Get Started</Button>
            </Link>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-center w-full lg:w-1/2">
        <div className="">
          <img
            className="object-cover"
            src="/hero.png"
            loading="eager"
            width="615"
            height="615"
            alt="Hero"
          />
        </div>
      </div>
    </div>
  );
};

export default Hero;
