import React, { useState } from "react";
import styles from "./auth.module.scss";
import { TiUserAddOutline } from "react-icons/ti";
import Card from "../../components/card/Card";
import { toast } from "react-toastify";
import { registerUser, validateEmail } from "../../services/authService";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { SET_LOGIN, SET_NAME } from "../../redux/features/auth/authSlice";
import Loader from "../../components/loader/Loader";

const initialState = {
  name: "",
  email: "",
  password: "",
  password2: "",
};

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setformData] = useState(initialState);
  const { name, email, password, password2 } = formData;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setformData({ ...formData, [name]: value });
  };

  const validateInputs = () => {
    if (!name || !email || !password) {
      toast.error("All fields are required");
      return false;
    }
    if (password.length < 6) {
      toast.error("Passwords must be at least 6 characters long");
      return false;
    }
    if (!validateEmail(email)) {
      toast.error("Please enter a valid email");
      return false;
    }
    if (password !== password2) {
      toast.error("Passwords do not match");
      return false;
    }
    return true;
  };

  const register = async (e) => {
    e.preventDefault();
    if (!validateInputs()) return;

    const userData = { name, email, password };
    setIsLoading(true);
    try {
      const data = await registerUser(userData);
      console.log(data); // Add this to see what is being returned
      dispatch(SET_LOGIN(true));
      dispatch(SET_NAME(data.name));
      setformData(initialState);
      navigate("/dashboard");
      toast.success("Registration successful!");
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Registration failed. Please try again."
      );
      console.error("Registration Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`container ${styles.auth}`}>
      {isLoading && <Loader />}
      <Card>
        <div className={styles.form}>
          <div className="--flex-center">
            <TiUserAddOutline size={35} color="#999" />
          </div>
          <h2>Register</h2>

          <form onSubmit={register}>
            <input
              type="text"
              placeholder="Name"
              required
              name="name"
              value={name}
              onChange={handleInputChange}
            />
            <input
              type="email"
              placeholder="Email"
              required
              name="email"
              value={email}
              onChange={handleInputChange}
            />
            <input
              type="password"
              placeholder="Password"
              required
              name="password"
              value={password}
              onChange={handleInputChange}
            />
            <input
              type="password"
              placeholder="Confirm Password"
              required
              name="password2"
              value={password2}
              onChange={handleInputChange}
            />
            <button type="submit" className="--btn --btn-primary --btn-block">
              Register
            </button>
          </form>

          <span className={styles.register}>
            <Link to="/">Home</Link>
            <p> &nbsp; Already have an account? &nbsp;</p>
            <Link to="/login">Login</Link>
          </span>
        </div>
      </Card>
    </div>
  );
};

export default Register;
