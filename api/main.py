from fastapi import FastAPI, Form
import mysql.connector
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os

# Зареждане на .env променливите
load_dotenv()

app=FastAPI()
conn=mysql.connector.connect(
    host=os.getenv("DB_HOST"),
    user=os.getenv("DB_USER"),
    passwd=os.getenv("DB_PASSWORD"),
    database=os.getenv("DB_NAME")
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

@app.get("/")
def root():
    return {"message": "Hello, world!"}

@app.get("/get_tasks")
def get_tasks():
    cursor=conn.cursor(dictionary=True)
    cursor.execute("select * from todo")
    records=cursor.fetchall()
    return records

@app.post("/add_task")
def add_task(task: str=Form(...)):
    cursor=conn.cursor()
    cursor.execute("insert into todo (task) values (%s)", (task,))
    conn.commit()
    return "Added Succesfully"

@app.post("/delete_task")
def add_task(id: str=Form(...)):
    cursor=conn.cursor()
    cursor.execute("delete from todo where id = %s", (id,))
    conn.commit()
    return "Deleted Succesfully"

@app.post("/swap_tasks")
def swap_tasks(id1: str=Form(...), id2: str=Form(...)):
    cursor=conn.cursor()
    cursor.execute("SELECT position FROM todo WHERE id = %s", (id1,))
    position1 = cursor.fetchone()

    cursor.execute("SELECT position FROM todo WHERE id = %s", (id2,))
    position2 = cursor.fetchone()

    if position1 is None or position2 is None:
        return "One or both tasks not found", 404

    cursor.execute("UPDATE todo SET position = %s WHERE id = %s", (position2[0], id1))
    cursor.execute("UPDATE todo SET position = %s WHERE id = %s", (position1[0], id2))

    conn.commit()
    return "Tasks Swapped Succesfully"