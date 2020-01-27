package model.other;

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
public class StringDataOther {

    public String webUserId = "";
    public String userEmail = "";
    public String userPassword = "";
    public String birthday = "";
    public String membershipFee = "";
    public String employeeId = "";
    public String employeeEmail = "";
    public String employeeName = "";
    public String employeeBirthday = "";
    public String employeeImage = "";
    public String employeeDescription = "";   // Foreign Key
    public String employeeExp = ""; // getting it from joined user_role table.

    public String errorMsg = "";

    // default constructor leaves all data members with empty string (Nothing null).
    public StringDataOther() {
    }

    // overloaded constructor sets all data members by extracting from resultSet.
    public StringDataOther(ResultSet results) {
        try {
            this.webUserId = FormatUtils.formatInteger(results.getObject("web_user_id"));
            this.userEmail = FormatUtils.formatString(results.getObject("user_email"));
            this.userPassword = FormatUtils.formatString(results.getObject("user_password"));
            this.birthday = FormatUtils.formatDate(results.getObject("birthday"));
            this.membershipFee = FormatUtils.formatDollar(results.getObject("membership_fee"));
            this.employeeId = FormatUtils.formatInteger(results.getObject("applicant_id"));
            this.employeeEmail = FormatUtils.formatString(results.getObject("employee_email"));
            this.employeeName = FormatUtils.formatString(results.getObject("employee_name"));
            this.employeeImage = FormatUtils.formatString(results.getObject("employee_image"));
            this.employeeDescription = FormatUtils.formatString(results.getObject("employee_description"));
            this.employeeBirthday = FormatUtils.formatDate(results.getObject("employee_bday"));
            this.employeeExp = FormatUtils.formatInteger(results.getObject("employee_working_exp"));
                    
        } catch (Exception e) {
            this.errorMsg = "Exception thrown in model.webUser.StringData (the constructor that takes a ResultSet): " + e.getMessage();
        }
    }

    public int getCharacterCount() {
        String s = this.webUserId + this.userEmail + this.userPassword + this.birthday
                + this.membershipFee  + this.employeeBirthday + this.employeeDescription 
                + this.employeeEmail + this.employeeExp + this.employeeId + this.employeeName + this.employeeImage;
        return s.length();
    }

    public String toString() {
        return "Web User Id:" + this.webUserId
                + ", User Email: " + this.userEmail
                + ", User Password: " + this.userPassword
                + ", Birthday: " + this.employeeBirthday
                + ", Membership Fee: " + this.membershipFee
                + ", employee ID: " + this.employeeId
                + ", employee Name: " + this.employeeName
                + ", employee email: " + this.employeeEmail
                + ", employee Birthday: " + this.employeeBirthday
                + ", employee Description: " + this.employeeDescription
                + ", employee Experience: " + this.employeeExp
                + ", employee Image: " + this.employeeImage;
        
    }
}
