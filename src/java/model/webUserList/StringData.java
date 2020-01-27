package model.webUserList;

import dbUtils.FormatUtils;
import java.sql.ResultSet;


/* The purpose of this class is just to "bundle together" all the 
 * data associated with a single role in the database.
 * 
 * There are no getter or setter methods since we are not trying to
 * protect this data in any way.  We want to let the JSP page have
 * free access to put data in or take it out. */
public class StringData {

    public String webUserId = "";   // Foreign Key

    public String errorMsg = "";

    // default constructor leaves all data members with empty string.
    public StringData() {
    }

    // overloaded constructor sets all data members by extracting from resultSet.
    public StringData(ResultSet results) {
        try {
            this.webUserId = FormatUtils.formatInteger(results.getObject("web_user_id"));
        } catch (Exception e) {
            this.errorMsg = "Exception thrown in model.role.StringData (the constructor that takes a ResultSet): "
                    + e.getMessage();
        }
    }

    public String toString() {
        return ", User Role Id: " + this.webUserId;
    }
}
