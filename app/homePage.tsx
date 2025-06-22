"use client";

import Image from "next/image";
import styles from "./home.module.css";
import bg from "@/public/bg-lr.png";
import { IoIosEye, IoIosEyeOff } from "react-icons/io";
import { useCallback, useContext, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ButtonLoadingSpinner } from "@/components/loadingSpinner";
import { addNewUser, getUser } from "./actions/user";
import { AppContext } from "@/context/app";
import ToastAlert from "@/components/alert";

export default function Home({ backPage }: { backPage?: string | undefined}) {

  const router = useRouter();
  const { setUser } = useContext(AppContext);
  const [state, setState] = useState<string>("logIn");
  const [error, setError] = useState<boolean | string>(false);
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState(true);
  const userNameRef = useRef<HTMLInputElement | null>(null);
  const passwordRef = useRef<HTMLInputElement | null>(null);

  const toggleEye = useCallback(() => { // tested, does not trigger handleSubmit
    setPassword(!password);
  }, [password]);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if(loading) return;
      setError(false);
      setLoading(true);
      const userName = userNameRef.current?.value;
      const password = passwordRef.current?.value;
      if(!userName || !password) return;
      const reqBody = { userName, password };
      const user = (state === "logIn" ? await getUser(reqBody) : await addNewUser(reqBody));
      setLoading(false);
      if(typeof user === "string") {
        return setError(
          user === "User not found" ?
          "User not found. Check details or register if new user" :
          "Username has already been used. Try a different one."
        );
      }
      setUser(user);
      setLoading(false);
      router.push(backPage || "/home");
    } catch(err) {
      console.log(err);
      setError("There was an error. Check internet and retry.");
      setLoading(false);
    }
  }, [state, backPage]);

  return (
    <div className={styles.Home}>
      {error && <ToastAlert 
      text={error === true ? "There was an error. Check internet and retry." : error} 
      clickFn={() => setError(false)} />} 

      <div className={styles.Home_content}>
        <Image src={bg} className={styles.Home_bg} alt="bg" />
        <div className={styles.Home_body}>
          <h1>mavvle</h1>
          <h3>Welcome!</h3>
          <div className={styles.Home_nav}>
            <nav>
              <div className={`${styles.Home_nav_route} ${styles[`Home_nav_route_${state === "logIn"}`]}`}
              onClick={() => setState("logIn")}>Sign in</div>
              <div className={`${styles.Home_nav_route} ${styles[`Home_nav_route_${state === "signUp"}`]}`}
              onClick={() => setState("signUp")}>Register</div>
            </nav>
          </div>
          <form className={styles.Home_form} onSubmit={handleSubmit}>
            
            <div className={styles.Home_form_field}>
              <label>Username</label>
              <input placeholder="Enter a username" ref={userNameRef} required />
            </div>
            <div className={`${styles.Home_form_field}`}>
              <label>Password</label>
              <div className={`${styles.Home_form_input} ${styles.HFI_password}`}>
                <input placeholder="Enter password" type={password ? "password" : "text"} ref={passwordRef} required />
                <div className={styles.HFI} onClick={toggleEye}>
                {
                  password ? 
                  <IoIosEye className={styles.HFI_icon} /> 
                  : 
                  <IoIosEyeOff className={styles.HFI_icon} />
                }
                </div>
              </div>
            </div>
            <div className={styles.Home_form_submit}>
              <button className="flex items-center justify-center">
                {loading && <ButtonLoadingSpinner width={'17px'} height={"24px"} color={'white'} />}
                <span style={{marginLeft: "12px"}}>Submit</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
};