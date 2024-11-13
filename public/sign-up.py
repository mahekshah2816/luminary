# signup.py
import mysql.connector
import cgi
import cgitb

cgitb.enable()

db = mysql.connector.connect(
    host="localhost",
    user="root",  
    password="@Nsherwani03",  
    database="luminary"
)

cursor = db.cursor()


form = cgi.FieldStorage()
username = form.getvalue("username")
email = form.getvalue("email")
password = form.getvalue("password")


try:
    cursor.execute("INSERT INTO users (username, email, password) VALUES (%s, %s, %s)", (username, email, password))
    db.commit()
    print("Content-type: text/html\n")
    print("<html><body>")
    print("<h2>Sign-Up Successful</h2>")
    print("<p>Welcome, {}! You have successfully signed up.</p>".format(username))
    print("</body></html>")
except mysql.connector.Error as err:
    print("Content-type: text/html\n")
    print("<html><body>")
    print("<h2>Error</h2>")
    print("<p>There was an error signing up: {}</p>".format(err))
    print("</body></html>")


cursor.close()
db.close()
