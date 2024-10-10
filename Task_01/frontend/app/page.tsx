"use client"
import { useState } from "react";
import { BsRobot } from "react-icons/bs";
import { SiRobotframework } from "react-icons/si";
import Alert from '@mui/material/Alert';

const path_api = "http://127.0.0.1:8000"

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState<boolean>(false);
  const [startTime, setStartTime] = useState<string>("");
  const [endTime, setEndTime] = useState<string>("");

  const [startHours, setStartHours] = useState<number>(0);
  const [startMinutes, setStartMinutes] = useState<number>(0);
  const [startSeconds, setStartSeconds] = useState<number>(0);
  const [endHours, setEndHours] = useState<number>(0);
  const [endMinutes, setEndMinutes] = useState<number>(0);
  const [endSeconds, setEndSeconds] = useState<number>(0);
  const [total, setTotal] = useState<number | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      const formData = new FormData();
      formData.append("file", file);

      try {
        const response = await fetch(`${path_api}/upload`, {
          method: "POST",
          body: formData,
        });

        if (response.ok) {
          const data = await response.json();
          setUploadSuccess(true);
        } else {
          console.error("Failed to upload file");
        }
      } catch (error) {
        console.error("Error uploading file:", error);
      }
    }
    
    setFile(file);
  };

  const handleQuery = async () => {
    if (!file) {
      alert('Please choose a file first.');
      return;
    }
    
    if (!startTime || !endTime) {
      alert('Please enter both start and end times.');
      return;
    }

    try {
      const response = await fetch(`${path_api}/query`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          start_time: startTime,
          end_time: endTime,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setTotal(data.total);
      } else {
        console.error("Failed to perform query");
      }
    } catch (error) {
      console.error("Error performing query:", error);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-200">
      <div className="bg-white p-4 rounded-xl shadow-lg mx-auto px-20 py-10 ">
        <div className="mb-4">
          {file ? <SiRobotframework className="text-7xl text-sky-600 mx-auto mb-4" /> : <BsRobot className="text-7xl text-gray-600 mx-auto mb-4" />}
          {file ? <h1 className="text-xl font-bold">Uploaded Successfully</h1> : <h1 className="text-xl font-bold mx-auto text-center">Upload Your File</h1>}
        </div>
        <div className="flex w-3/4 mx-auto flex-col bg-sky-500 py-2 rounded-md hover:cursor-pointer hover:bg-sky-700 hover:shadow-lg"> 
          <input type="file" id="file-upload" className="hidden " accept=".xls,.xlsx" onChange={handleFileChange} />
          <label htmlFor="file-upload" className="text-white mx-auto">Choose File</label>
        </div>
        {file ? <div className="text-gray-500 text-sm text-center mt-2">{file.name}</div> : <div className="text-gray-500 text-sm text-center mt-2">No file chosen</div>}
        {file && (uploadSuccess ? <Alert severity="success">Uploaded Successfully</Alert> : <Alert severity="warning">Upload File</Alert>)}
        <div className="flex flex-col mt-4">
          <div className="flex flex-col"><h1 className="text-md text-gray-500 font-bold">Query Data:</h1></div>
          <div className="flex flex-col">
            <label htmlFor="start-time" className="text-gray-500 text-sm">Start Time:</label>
            <div className="flex space-x-2">
              <input type="number" id="start-hours" className="border border-gray-300 rounded-md p-2 w-16" placeholder="HH" min="0" max="23" onChange={(e) => { setStartHours(Number(e.target.value)); setStartTime(`${e.target.value}:${startMinutes}:${startSeconds}`); }} />
              <input type="number" id="start-minutes" className="border border-gray-300 rounded-md p-2 w-16" placeholder="MM" min="0" max="59" onChange={(e) => { setStartMinutes(Number(e.target.value)); setStartTime(`${startHours}:${e.target.value}:${startSeconds}`); }} />
              <input type="number" id="start-seconds" className="border border-gray-300 rounded-md p-2 w-16" placeholder="SS" min="0" max="59" onChange={(e) => { setStartSeconds(Number(e.target.value)); setStartTime(`${startHours}:${startMinutes}:${e.target.value}`); }} />
            </div>
          </div>
          <div className="flex flex-col">
            <label htmlFor="end-time" className="text-gray-500 text-sm">End Time:</label>
            <div className="flex space-x-2">
              <input type="number" id="end-hours" className="border border-gray-300 rounded-md p-2 w-16" placeholder="HH" min="0" max="23" onChange={(e) => { setEndHours(Number(e.target.value)); setEndTime(`${e.target.value}:${endMinutes}:${endSeconds}`); }} />
              <input type="number" id="end-minutes" className="border border-gray-300 rounded-md p-2 w-16" placeholder="MM" min="0" max="59" onChange={(e) => { setEndMinutes(Number(e.target.value)); setEndTime(`${endHours}:${e.target.value}:${endSeconds}`); }} />
              <input type="number" id="end-seconds" className="border border-gray-300 rounded-md p-2 w-16" placeholder="SS" min="0" max="59" onChange={(e) => { setEndSeconds(Number(e.target.value)); setEndTime(`${endHours}:${endMinutes}:${e.target.value}`); }} />
            </div>
          </div>
          <div className="mt-4 flex w-3/4 mx-auto flex-col bg-sky-500 py-2 rounded-md hover:cursor-pointer hover:bg-sky-700 hover:shadow-lg"> 
            <button onClick={handleQuery} className="text-white mx-auto">Query</button>
          </div>
          
          <div className="flex flex-col mt-4">
            <h1 className="text-md text-gray-500 font-bold">Total Amount: {total}</h1>
          </div>
        </div>
      </div>
      
    </div>
  );
}
