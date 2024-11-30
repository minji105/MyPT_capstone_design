import React, { useEffect, useState } from "react";
import styles from "./Record.module.css";
import { useAuth } from "../contexts/AuthContext";

export default function Record() {
  const { userId } = useAuth();
  const [records, setRecords] = useState([]);
  const [totalDuration, setTotalDuration] = useState(0);

  useEffect(() => {
    console.log("Current userId:", userId);
    fetch(`http://localhost:3001/api/save-exercise`)
      .then(res => res.json())
      .then(data => setRecords(data));
  }, [userId]);

  return (
    <div className={styles.container}>
      {records.length > 0 ? (
        <>
          <div className={styles.rowName}>
            <p>date</p>
            <p>exercise</p>
            <p>duration</p>
          </div>
          {records.map((record, index) => (
            <div className={styles.card}>
              <p>{record.date.split('T')[0]}</p>
              <p>{record.exerciseType}</p>
              <p>{Math.floor(record.duration / 60)}분 {record.duration % 60}초</p>
            </div>
          ))}
        </>
      ) : (
        <>
          <h1>empty</h1>
          <h1>empty</h1>
          <p>{userId}</p>
        </>
      )}
    </div>
  )
}