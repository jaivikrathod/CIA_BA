import React from 'react';
import { useForm } from 'react-hook-form';
import { ToastContainer, toast } from 'react-toastify';
import axios from 'axios';
import 'react-toastify/dist/ReactToastify.css';
import { useParams } from 'react-router-dom';

export default function InsuranceCommonDetails2() {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const api = "http://localhost:3005";
    const { id } = useParams();

    const onSubmit = async (data) => {
        try {
            data.id = id;
            const response = await axios.post(`${api}/common-general`, data);
            if (response.data.message) {
                toast.success('Form submitted successfully!');
            } else {
                throw new Error('Submission failed');
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'An error occurred while submitting the form.');
        }
    };

    return (
        <>
            <form className="container mt-5" onSubmit={handleSubmit(onSubmit)}>
                <div className="row g-3">
                    {[  
                        { label: "IDV", type: "text", id: "IDV", validation: { required: "IDV is required" } },
                        { label: "Current NCB", type: "text", id: "CURRENTNCB", validation: { required: "Current NCB is required" } },
                        { label: "Insurance", type: "text", id: "INSURANCE", validation: { required: "Insurance is required" } },
                        { label: "Policy No", type: "text", id: "POLICYNO", validation: { required: "Policy No is required" } },
                        { label: "OD Premium", type: "text", id: "ODPREMIUM", validation: { required: "OD Premium is required" } },
                        { label: "TP Premium", type: "text", id: "TPPREMIUM", validation: { required: "TP Premium is required" } },
                        { label: "Package Premium", type: "text", id: "PACKAGEPREMIUM", validation: { required: "Package Premium is required" } },
                        { label: "GST", type: "text", id: "GST", validation: { required: "GST is required" } },
                        { label: "Premium", type: "text", id: "PREMIUM", validation: { required: "Premium is required" } },
                        { label: "Collection Date", type: "date", id: "COLLECTIONDATE", validation: { required: "Collection Date is required" } },
                        { label: "Cases Type", type: "text", id: "CASESTYPE", validation: { required: "Cases Type is required" } },
                        { label: "Exe Name", type: "text", id: "EXENAME", validation: { required: "Exe Name is required" } },
                        { label: "Payment Mode", type: "text", id: "PAYMENTMODE", validation: { required: "Payment Mode is required" } },
                        { label: "New Policy Start Date", type: "date", id: "NEWPOLICYSTARTDATE", validation: { required: "Start Date is required" } },
                        { label: "New Policy Expiry Date", type: "date", id: "NEWPOLICYEXPIRYDATE", validation: { required: "Expiry Date is required" } },
                        { label: "Agent Code", type: "text", id: "AGNTCODE", validation: { required: "Agent Code is required" } },
                        { label: "Payout Percent", type: "number", id: "PAYOUTPERCCENT", validation: { required: "Payout Percent is required" } },
                        { label: "Amount", type: "number", id: "AMMOUNT", validation: { required: "Amount is required" } },
                        { label: "TDS", type: "number", id: "TDS", validation: { required: "TDS is required" } },
                    ].map((field) => (
                        <div className="col-md-6" key={field.id}>
                            <label htmlFor={field.id} className="form-label">{field.label}</label>
                            <input 
                                type={field.type} 
                                id={field.id} 
                                className={`form-control ${errors[field.id] ? 'is-invalid' : ''}`}
                                {...register(field.id, field.validation)}
                            />
                            {errors[field.id] && (
                                <div className="invalid-feedback">{errors[field.id].message}</div>
                            )}
                        </div>
                    ))}
                </div>
                <button type="submit" className="btn btn-primary mt-3">Submit</button>
            </form>
            <ToastContainer />
        </>
    );
}
