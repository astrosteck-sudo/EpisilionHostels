// import { PageHeader } from "../PageHeader/PageHeader";
// import styles from  './logins.module.css';
// import { SiteFooter } from "../SiteFooter/SiteFooter";
// import { Link } from "react-router-dom";
// import { useEffect, useState } from "react";


// export function SignUpPage({ navlink, setNavLink }) {

//     useEffect(() => {
//         document.body.classList.add("body-bg");
//         return () => {
//             document.body.classList.remove("body-bg");
//         };
//     }, []);

//     const [type, setType] = useState('password');

//     function showpassword(parameter){
//         // if(type === 'password'){
//         //     setType('text')
//         // }else{
//         //     setType('password')
//         // }
//         //console.log('Show password has been clicked')
//         if(parameter === 'password'){
//             setType('text');
//         }else{
//             setType('password')
//         }
//         console.log(parameter)
        
//     }


//     return (
//         <>
//             <title>Sign-Up | Episilion Hostels</title>
//             <PageHeader navlink={navlink} setNavLink={setNavLink} />
//             <div className={styles["wrapper"]}>
//                 <main className={styles["logins-main"]}>
//                     <div className={styles["login-box"]}>
//                         <form action="">
//                             <h2>Sign Up</h2>
//                             <div className={styles["input-box"]}>
//                                 <input type="text" title="Enter Your Name Here" required></input><br></br>
//                                 <label >Enter Your Name</label>
//                             </div>

//                             <div className={styles["input-box"]}>
//                                 <input type="email" required title="Enter Your Email Address Here"></input><br></br>
//                                 <label>Enter Your Email Address</label>
//                             </div>

//                             <div className={styles["input-box"]}>
//                                 <input type={type} id="user-password" required title="Enter Your Password Here"></input>
//                                 <label>Enter Your Password</label>
//                             </div>

//                             <div className={styles["input-box"]}>
//                                 <input type={type} id="comfirm-user-password" required></input>
//                                 <label>Comfirm Password</label>
//                             </div>

                            // <div className={styles["show-password"]}>
                            //     <input type="checkbox" className={styles["show-password-checkbox"]} id="showPassword" onClick={() => showpassword(type)} /><label className={styles["show-password-text"]} for="showPassword">Show Password</label>
                            // </div>

//                             <div className={styles["buttons"]} >
//                                 <button type="submit">Create Account</button>
//                             </div>
//                             <p className={styles["altenative-text"]}>Already Have An Account <Link to="/login">Login</Link></p>
//                         </form>
//                     </div>
//                 </main>
//                 
//             </div>

//         </>
//     )
// }