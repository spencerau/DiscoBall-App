import mysql.connector

connection = mysql.connector.connect(
    host="35.185.219.33",
    user="root",
    password="myname",
    database="celebratory-tech"
)

cursor = connection.cursor()

query = ''' 
SELECT * FROM Responses
'''

cursor.execute(query)
responses = cursor.fetchall()

print(responses)