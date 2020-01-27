package model.other;

import dbUtils.DbConn;
import dbUtils.PrepStatement;
import dbUtils.ValidationUtils;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import model.other.*;

public class DbModsOther {

    public static StringDataListOther findById (DbConn dbc, String id) {
        
        StringDataListOther sdl = new StringDataListOther();
        try {
            String sql ="SELECT applicant_id, employee_name, employee_email, employee_description, "
                    + "employee_working_exp, employee_image, "
                    + "employee_bday, teamMembers.web_user_id , user_email, "
                    + "user_password, birthday, membership_fee, web_user.user_role_id "
                    + "FROM teamMembers, web_user WHERE teamMembers.web_user_id = web_user.web_user_id "
                    + "AND web_user.web_user_id = ?";

            PreparedStatement stmt = dbc.getConn().prepareStatement(sql);

            // Encode the id (that the user typed in) into the select statement, into the first 
            // (and only) ? 
            stmt.setString(1, id);

            ResultSet results = stmt.executeQuery();
            if (results.next()) { // id is unique, one or zero records expected in result set
                sdl.add(results);
            }
            results.close();
            stmt.close();
        } catch (Exception e) {
            StringDataOther sd = new StringDataOther();
            sd.errorMsg = "Exception thrown in WebUserView.getUserById(): " + e.getMessage();
            sdl.add(sd);
        }
        return sdl;

    } // getUserById
 // method delete returns "" (empty string) if the delete worked fine. Otherwise, 
    // it returns an error message.
    public static String delete(String userId, DbConn dbc) {

        if (userId == null) {
            return "Error in modelwebUser.DbMods.delete: cannot delete web_user record because 'userId' is null";
        }

        // This method assumes that the calling Web API (JSP page) has already confirmed 
        // that the database connection is OK. BUT if not, some reasonable exception should 
        // be thrown by the DB and passed back anyway... 
        String result = ""; // empty string result means the delete worked fine.
        try {

            String sql = "DELETE FROM teamMembers WHERE web_user_id = ?";

            // This line compiles the SQL statement (checking for syntax errors against your DB).
            PreparedStatement pStatement = dbc.getConn().prepareStatement(sql);

            // Encode user data into the prepared statement.
            pStatement.setString(1, userId);

            int numRowsDeleted = pStatement.executeUpdate();

            if (numRowsDeleted == 0) {
                result = "Record not deleted - there was no record with web_user_id " + userId;
            } else if (numRowsDeleted > 1) {
                result = "Programmer Error: > 1 record deleted. Did you forget the WHERE clause?";
            }

        } catch (Exception e) {
            result = "Exception thrown in model.webUser.DbMods.delete(): " + e.getMessage();
        }

        return result;
    }
    private static StringDataOther validate(StringDataOther inputData) {

        StringDataOther errorMsgs = new StringDataOther();

        /* Useful to copy field names from StringData as a reference
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
         */
        // Validation
        errorMsgs.employeeEmail = ValidationUtils.stringValidationMsg(inputData.employeeName, 45, true);
        errorMsgs.employeeName = ValidationUtils.stringValidationMsg(inputData.employeeName, 45, true);
        
        errorMsgs.employeeBirthday = ValidationUtils.dateValidationMsg(inputData.employeeBirthday, true);
        errorMsgs.employeeImage = ValidationUtils.stringValidationMsg(inputData.employeeImage,300, true);
        errorMsgs.employeeDescription = ValidationUtils.stringValidationMsg(inputData.employeeImage,300, true);
        errorMsgs.employeeExp = ValidationUtils.integerValidationMsg(inputData.employeeExp, false);
        errorMsgs.webUserId = ValidationUtils.integerValidationMsg(inputData.webUserId, true);

        return errorMsgs;
    } // validate 

    public static StringDataOther insert(StringDataOther inputData, DbConn dbc) {

        StringDataOther errorMsgs = new StringDataOther();
        errorMsgs = validate(inputData);
        if (errorMsgs.getCharacterCount() > 0) {  // at least one field has an error, don't go any further.
            errorMsgs.errorMsg = "Please try again";
            return errorMsgs;

        } else { // all fields passed validation
String sql = "INSERT INTO teamMembers (employee_email, employee_name, employee_bday, employee_image, employee_description,  employee_working_exp, web_user_id) "
                    + "values (?,?,?,?,?,?, ?)";

            // PrepStatement is Sally's wrapper class for java.sql.PreparedStatement
            // Only difference is that Sally's class takes care of encoding null 
            // when necessary. And it also System.out.prints exception error messages.
            PrepStatement pStatement = new PrepStatement(dbc, sql);

            // Encode string values into the prepared statement (wrapper class).
            pStatement.setString(1, inputData.employeeEmail); // string type is simple
            pStatement.setString(2, inputData.employeeName);
            pStatement.setDate(3, ValidationUtils.dateConversion(inputData.employeeBirthday));
            pStatement.setString(4, inputData.employeeImage);
            pStatement.setString(5, inputData.employeeDescription);
            pStatement.setInt(6, ValidationUtils.integerConversion(inputData.employeeExp));
            pStatement.setInt(7, ValidationUtils.integerConversion(inputData.webUserId));
          

            // here the SQL statement is actually executed
            int numRows = pStatement.executeUpdate();

            // This will return empty string if all went well, else all error messages.
            errorMsgs.errorMsg = pStatement.getErrorMsg();
            if (errorMsgs.errorMsg.length() == 0) {
                if (numRows == 1) {
                    errorMsgs.errorMsg = ""; // This means SUCCESS. Let the user interface decide how to tell this to the user.
                } else {
                    // probably never get here unless you forgot your WHERE clause and did a bulk sql update.
                    errorMsgs.errorMsg = numRows + " records were inserted when exactly 5 was expected.";
                }
            } else if (errorMsgs.errorMsg.contains("foreign key")) {
                errorMsgs.errorMsg = "Invalid User Role Id";
            } else if (errorMsgs.errorMsg.contains("Duplicate entry")) {
                errorMsgs.errorMsg = "That email address is already taken";
            }

        } // customerId is not null and not empty string.
        return errorMsgs;
    } // insert

    public static StringDataOther update(StringDataOther inputData, DbConn dbc) {


        StringDataOther errorMsgs = new StringDataOther();
        errorMsgs = validate(inputData);
        if (errorMsgs.getCharacterCount() > 0) {  // at least one field has an error, don't go any further.
            errorMsgs.errorMsg = "Please try again";
            return errorMsgs;

        } else { // all fields passed validation

            /*
                String sql = "SELECT web_user_id, user_email, user_password, membership_fee, birthday, "+
                    "web_user.user_role_id, user_role_type "+
                    "FROM web_user, user_role where web_user.user_role_id = user_role.user_role_id " + 
                    "ORDER BY web_user_id ";
             */
            String sql = "UPDATE teamMembers SET employee_email=?, employee_name=?, employee_bday=?, employee_image=?, employee_description=?,  employee_working_exp=? "
                    + " WHERE  web_user_id= ?";

            // PrepStatement is Sally's wrapper class for java.sql.PreparedStatement
            // Only difference is that Sally's class takes care of encoding null 
            // when necessary. And it also System.out.prints exception error messages.
            PrepStatement pStatement = new PrepStatement(dbc, sql);

            // Encode string values into the prepared statement (wrapper class).
            pStatement.setString(1, inputData.employeeEmail); // string type is simple
            pStatement.setString(2, inputData.employeeName);
            pStatement.setDate(3, ValidationUtils.dateConversion(inputData.employeeBirthday));
            pStatement.setString(4, inputData.employeeImage);
            pStatement.setString(5, inputData.employeeDescription);
            pStatement.setInt(6, ValidationUtils.integerConversion(inputData.employeeExp));
            pStatement.setInt(7, ValidationUtils.integerConversion(inputData.webUserId));

            // here the SQL statement is actually executed
            int numRows = pStatement.executeUpdate();

            // This will return empty string if all went well, else all error messages.
            errorMsgs.errorMsg = pStatement.getErrorMsg();
            if (errorMsgs.errorMsg.length() == 0) {
                if (numRows == 1) {
                    errorMsgs.errorMsg = ""; // This means SUCCESS. Let the user interface decide how to tell this to the user.
                } else {
                    // probably never get here unless you forgot your WHERE clause and did a bulk sql update.
                    errorMsgs.errorMsg = numRows + " records were updated (expected to update one record).";
                }
            } else if (errorMsgs.errorMsg.contains("foreign key")) {
                errorMsgs.errorMsg = "Invalid web User ID Id";
            } else if (errorMsgs.errorMsg.contains("Duplicate entry")) {
                errorMsgs.errorMsg = "That email address is already taken";
            }

        } // customerId is not null and not empty string.
        return errorMsgs;
    } // update


} // class
