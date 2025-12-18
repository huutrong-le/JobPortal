"use client";
import { useGlobalContext } from "@/context/globalContext";
import React from "react";
import { Label } from "../ui/label";
import "react-quill-new/dist/quill.snow.css";
import { Separator } from "../ui/separator";
import { Input } from "../ui/input";
import { Checkbox } from "../ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import dynamic from "next/dynamic";

const ReactQuill = dynamic(() => import("react-quill-new"), {
  ssr: false,
});

function MyEditor() {
  const { setJobDescription, jobDescription } = useGlobalContext();

  return (
    <div className="flex-1 overflow-hidden">
      <ReactQuill
        value={jobDescription}
        onChange={setJobDescription}
        style={{
          minHeight: "200px",
          maxHeight: "400px",
          overflow: "auto",
        }}
        modules={{
          toolbar: true,
        }}
        className="custom-quill-editor"
      />
    </div>
  );
}

function JobDetails() {
  const {
    handleSalaryChange,
    salary,
    salaryType,
    setSalaryType,
    setNegotiable,
    negotiable,
  } = useGlobalContext();
  return (
    <div className="p-6 flex flex-col gap-4 bg-background border border-border rounded-lg">
      <div className="grid grid-cols-2 gap-6">
        <div className="flex-1">
          <h3 className="text-black font-bold">Mô tả công việc</h3>
          <Label htmlFor="jobDescription" className="text-gray-500 mt-2">
            Cung cấp mô tả chi tiết về công việc.
          </Label>
        </div>
        <div className="flex-1">
          <MyEditor />
        </div>
      </div>

      <Separator className="my-2" />

      <div className="relative grid grid-cols-2 gap-6">
        <div>
          <h3 className="text-black font-bold">Mức lương</h3>
          <Label htmlFor="salary" className="text-gray-500 mt-2">
            Nhập khoảng lương cho công việc.
          </Label>
        </div>

        <div>
          <Input
            type="number"
            id="salary"
            placeholder="Nhập mức lương"
            value={salary}
            onChange={handleSalaryChange}
            className="mt-2"
          />

          <div className="flex gap-2 mt-2 justify-between">
            <div className="flex items-center space-x-2 border border-gray-300 rounded-md p-2">
              <Checkbox id="negotiable" />
              <Label htmlFor="negotiable" className="text-gray-500">
                Thương lượng
              </Label>
            </div>
            <div className="flex items-center space-x-2 border border-gray-300 rounded-md p-2">
              <Checkbox
                id="hideSalary"
                checked={negotiable}
                onCheckedChange={setNegotiable}
              />
              <Label htmlFor="hideSalary" className="text-gray-500">
                Ẩn mức lương
              </Label>
            </div>

            <div>
              <Select onValueChange={setSalaryType}>
                <SelectTrigger>
                  <SelectValue placeholder="Chọn loại" />
                </SelectTrigger>
                <SelectContent className="w-[120px] mt-2">
                  <SelectItem value="Yearly">Hàng năm</SelectItem>
                  <SelectItem value="Month">Hàng tháng</SelectItem>
                  <SelectItem value="Hour">Hàng giờ</SelectItem>
                  <SelectItem value="Fixed">Cố định</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default JobDetails;
