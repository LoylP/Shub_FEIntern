"use client";
import React, { useState, useEffect } from 'react';
import Alert from '@mui/material/Alert';
import { BiArrowBack, BiArrowFromLeft  } from "react-icons/bi";

export default function Form() {
  const [dateTime, setDateTime] = useState(new Date().toISOString().slice(0, 16)); 
  const [quantity, setQuantity] = useState(""); 
  const [type, setType] = useState("");
  const [revenue, setRevenue] = useState("");
  const [price, setPrice] = useState("");
  const [errors, setErrors] = useState({
    type: false,
    price: false,
    quantity: false,
    revenue: false
  });
  const [success, setSuccess] = useState(false);
  const [isOpen, setIsOpen] = useState(true); 

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => setSuccess(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  const validateNumber = (value: string) => { 
    return !isNaN(Number(value)) && value !== "";
  };

  const handleShow = () => {
    const newErrors = {
      price: !validateNumber(price),
      quantity: !validateNumber(quantity),
      revenue: !validateNumber(revenue),
      type: type === "",
    };

    setErrors(newErrors);

    if (!Object.values(newErrors).some(Boolean)) {
      setSuccess(true);
    } else {
      setSuccess(false);
    }
  };

  const handleClose = () => { 
    setIsOpen(!isOpen);
  };

  return (
    <div className="max-w-lg mx-auto mt-10 bg-white shadow-lg rounded-lg w-full p-4">
        {success && (
          <Alert variant="outlined" severity="success" className="mb-4">
            Cập nhật thành công!
          </Alert>
        )}
        <div className='flex flex-col shadow-md mb-4 hover:shadow-xl bg-white p-4 rounded-lg'>
            <div className="flex justify-between items-center mb-4"> 
                <button className="flex items-center text-gray-600 hover:text-gray-800" onClick={handleClose}>
                    {isOpen ? <BiArrowBack className='mr-2' /> : <BiArrowFromLeft className='mr-2' />} 
                    {isOpen ? "Đóng" : "Mở"} 
                </button>
                <button 
                    className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors flex items-center"
                    onClick={handleShow} 
                >
                    Cập nhật
                </button>
            </div>
            <h1 className="text-3xl font-bold">Nhập giao dịch</h1>
        </div>
        {isOpen && ( 
            <div className='flex flex-col space-y-4'>
                <div className="rounded-xl border-2 border-gray-300 p-2 hover:shadow-lg">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Thời gian</label>
                    <input
                    type="datetime-local"
                    value={dateTime}
                    onChange={(e) => setDateTime(e.target.value)}
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                    />
                </div>
                <div className="rounded-xl border-2 border-gray-300 p-2 hover:shadow-lg">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Số lượng</label>
                    <input
                        value={quantity}  
                        onChange={(e) => setQuantity(e.target.value)}  
                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                    />
                    {errors.quantity && (
                      <Alert variant="outlined" severity="error" className="mt-2">
                        Giá trị nhập vào phải là giá trị số!
                      </Alert>
                    )}
                </div>
                <div className="rounded-xl border-2 border-gray-300 p-2 hover:shadow-lg">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Trụ</label>
                    <select
                        value={type}
                        onChange={(e) => setType(e.target.value)}
                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                        >
                        <option value="">Chọn trụ</option>
                        <option value="Trụ 1">Trụ 1</option>
                        <option value="Trụ 2">Trụ 2</option>
                        <option value="Trụ 3">Trụ 3</option>
                    </select>
                    {errors.type && (
                      <Alert variant="outlined" severity="error" className="mt-2">
                        Hãy chọn trụ!
                      </Alert>
                    )}
                </div>
                <div className="rounded-xl border-2 border-gray-300 p-2 hover:shadow-lg">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Doanh thu</label>
                    <input
                        value={revenue}
                        onChange={(e) => setRevenue(e.target.value)}
                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                    />
                    {errors.revenue && (
                      <Alert variant="outlined" severity="error" className="mt-2">
                        Giá trị nhập vào phải là giá trị số!
                      </Alert>
                    )}
                </div>
                <div className="rounded-xl border-2 border-gray-300 p-2 hover:shadow-lg">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Đơn giá</label>
                    <input
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                    />
                    {errors.price && (
                      <Alert variant="outlined" severity="error" className="mt-2">
                        Giá trị nhập vào phải là giá trị số!
                      </Alert>
                    )}
                </div>
            </div>
        )}
    </div>
  );
}