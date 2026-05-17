import { SiteFooter } from "../SiteFooter/SiteFooter";
import "./changePasswordPage.css";

export function ChangePasswordPage() {
  return (
    <>
      <p>This is the change password page</p>
      <form action="">
        <label for="">Old Password</label>
        <input type="text" />


        <label htmlFor="">New Password</label>
        <input type="text" name="" id="" />

        <label htmlFor="">Comfirm Password</label>
        <input type="text" />

        <label htmlFor="">Submit</label>
        <input type="submit" value="Submit" />

        <label htmlFor="">Clear</label>
        <input type="reset" value="Clear Form" />
      </form>

      <SiteFooter></SiteFooter>
    </>
  );
}
