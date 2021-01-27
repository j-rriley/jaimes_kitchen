package model.webUser;

import dbUtils.FormatUtils;
import java.sql.ResultSet;


/* The purpose of this class is just to "bundle together" all the 
 * character data that the user might type in when they want to 
 * add a new Customer or edit an existing customer.  This String
 * data is "pre-validated" data, meaning they might have typed 
 * in a character string where a number was expected.
 * 
 * There are no getter or setter methods since we are not trying to
 * protect this data in any way.  We want to let the JSP page have
 * free access to put data in or take it out. */
public class StringData {

    public String webUserId = "";
    public String userEmail = "";
    public String userPassword = "";
    public String userPassword2 = "";
    public String image = "";
    public String birthday = "";
    public String membershipFee = "";
    public String userRoleId = "";   // Foreign Key
    public String userRoleType = ""; // getting it from joined user_role table.

    public String errorMsg = "";

    // default constructor leaves all data members with empty string (Nothing null).
    public StringData() {
    }

    public int getCharacterCount() {
        String s = this.webUserId + this.userEmail + this.userPassword + this.userPassword2 + this.image
                + this.birthday + this.membershipFee + this.userRoleId + this.userRoleType;
        return s.length();
    }

    public String toString() {
        return "Web User Id:" + this.webUserId
                + ", User Email: " + this.userEmail
                + ", User Password: " + this.userPassword
                + ", User Password2: " + this.userPassword2
                + ", Image: " + this.image
                + ", Birthday: " + this.birthday
                + ", Membership Fee: " + this.membershipFee
                + ", User Role Id: " + this.userRoleId
                + ", User Role Type: " + this.userRoleType;
    }
}
