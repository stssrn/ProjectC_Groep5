"use client";
import styled from "@emotion/styled";

export const SettingOption = styled.div`
  margin: 10px 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const Switch = styled.label`
  position: relative;
  display: inline-block;
  width: 40px; // Reduced width
  height: 20px; // Reduced height
  margin-left: 10px; // Added margin

  & input {
    opacity: 0;
    width: 0;
    height: 0;
  }

  & .slider {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #ccc;
    transition: 0.4s;
    border-radius: 20px; // Adjusted for new height
  }

  & .slider:before {
    position: absolute;
    content: "";
    height: 18px; // Slightly smaller than the slider's height
    width: 18px; // Square shape
    left: 1px; // Adjusted for new dimensions
    bottom: 1px; // Adjusted for new dimensions
    background-color: white;
    transition: 0.4s;
    border-radius: 50%;
  }

  input:checked + .slider {
    background-color: #2196f3;
  }

  input:focus + .slider {
    box-shadow: 0 0 1px #2196f3;
  }

  input:checked + .slider:before {
    transform: translateX(20px); // Adjusted for new width
  }
`;
