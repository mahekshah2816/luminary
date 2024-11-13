import mysql.connector
import cgi
import cgitb

cgitb.enable()

db = mysql.connector.connect(
    host="localhost",
    user="root", 
    password="password", 
    database="luminary"
)

cursor = db.cursor()


form = cgi.FieldStorage()
email = form.getvalue("email")
password = form.getvalue("password")


cursor.execute("SELECT username FROM users WHERE email = %s AND password = %s", (email, password))
user = cursor.fetchone()

print("Content-type: text/html\n")
print("<html><body>")
if user:
    print("<h2>Welcome, {}!</h2>".format(user[0]))
    print("<p>You have successfully signed in.</p>")
else:
    print("<h2>Sign-In Failed</h2>")
    print("<p>Invalid email or password. Please try again.</p>")
print("</body></html>")


cursor.close()
db.close()
