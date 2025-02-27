"use client";
import { createContext, useContext, useState } from "react";

type ValidatorContextType = {
  validatorAddress: string;
  setValidatorAddress: (validatorAddress: string) => void;
  validatorSelected: boolean;
  setValidatorSelected: (validatorSelected: boolean) => void;
};

const ValidatorContext = createContext<ValidatorContextType | undefined>(undefined);

const ValidatorProvider = ({ children }: { children: React.ReactNode }) => {
  const [validatorSelected, setValidatorSelected] = useState<boolean>(false);
  const [validatorAddress, setValidatorAddress] = useState<string>("");

  return (
    <ValidatorContext.Provider
      value={{ validatorAddress, setValidatorAddress, validatorSelected, setValidatorSelected }}
    >
      {children}
    </ValidatorContext.Provider>
  );
};

const useValidator = () => {
  const context = useContext(ValidatorContext);
  if (!context) {
    throw new Error("useValidator must be used within a ValidatorProvider");
  }
  return context;
};

export { ValidatorProvider, useValidator };
