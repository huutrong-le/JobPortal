"use client";
import React, { createContext, use, useContext, useState } from "react";
import { useGlobalContext } from "./globalContext";
import axios from "axios";

const JobsContext = createContext();

export const JobsContextProvider = ({ children }) => {
    const { userProfile } = useGlobalContext();
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(false);
    const [userJobs, setUserJobs] = useState([]);
 
    const getJobs = async () => {
        setLoading(true);
        try {
            const res = await axios.get("/api/v1/jobs");
            setJobs(res.data);
        } catch (error) {
            console.log("Error getting jobs", error);
        } finally {
            setLoading(false);
        }
    };

    const createJob = async (job) => {
        try {
            const res = await axios.post("/api/v1/jobs", job);
            setJobs((prevJobs) => [res.data, ...prevJobs]);
        } catch (error) {
            console.log("Error creating job", error);
        }
    };

    useEffect(() => {
        getJobs();
    }, []);

    console.log("JobsContext - jobs:", jobs);

    return (
        <JobsContext.Provider value={{ jobs, loading, userJobs, getJobs }}>
            {children}
        </JobsContext.Provider>
    );
};

export const useJobsContext = () => {
    return useContext(JobsContext);
};
