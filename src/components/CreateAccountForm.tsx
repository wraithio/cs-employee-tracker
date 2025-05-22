"use client";

import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import Link from "next/link";
import { createUser, login } from "@/lib/services/user-services";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { AiOutlineLoading } from "react-icons/ai";
import { AuthInfo } from "@/lib/interfaces/interfaces";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const CreateAccountForm = () => {
  const { push } = useRouter();

  const [user, setUser] = useState({ email: "", password: "" });
  const [creationError, setCreationError] = useState(false);
  const [creatingAccount, setCreatingAccount] = useState(false);
  const [reveal, setReveal] = useState(false);

  const inputsFilled = user.email !== "" && user.password !== "";

  const changeUser = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUser({
      ...user,
      [event.target.id]: event.target.value.trim(),
    });

    if (creationError) {
      setCreationError(false);
    }
  };

  const handleCreateUser = async () => {
    setCreatingAccount(true);

    try {
      const newUser: AuthInfo = {
        id: 0,
        email: user.email,
        password: user.password,
      };
      console.log(newUser);
      // await createUser(newUser)
      if (await createUser(newUser)) {
        await login(newUser, false);
        push("/employees");
        // console.log(1)
      } else {
        setCreationError(true);
      }
    } catch {
      setCreationError(true);
    }

    setCreatingAccount(false);
  };

  return (
    <>
      <div>
        <div className="mb-2 block">
          <Label
            htmlFor="email"
            className={creationError ? "text-red-500" : ""}
          >
            Your email
          </Label>
        </div>
        <Input
          id="email"
          type="email"
          placeholder="name@example.com"
          required
          value={user.email}
          onChange={changeUser}
          color={creationError ? "failure" : ""}
          className={creationError ? "border-red-500" : ""}
        />
        {creationError && (
          <p className="text-red-500 text-sm">
            <span className="font-medium">Oops!</span> Email may already be in
            use.
          </p>
        )}
      </div>
      <div>
        <div className="mb-2 block">
          <Label htmlFor="password">Your password</Label>
        </div>
        <div className="relative">

        <Input
          id="password"
          type={reveal ? "text" : "password"}
          required
          value={user.password}
          onChange={changeUser}
          className={creationError ? "border-red-500" : ""}
          />
          {!reveal ?
                  (
                    <FaEye
                    className="absolute top-[25%] right-3 cursor-pointer"
                    onClick={() => setReveal(true)}
                    />
                  ) : (
                    <FaEyeSlash
                    className="absolute top-[25%] right-3 cursor-pointer"
                    onClick={() => setReveal(false)}
                    />
                  ) }
                  </div>
      </div>
      <Button
        onClick={handleCreateUser}
        disabled={!inputsFilled || creatingAccount}
      >
        {creatingAccount ? (
          <>
            <AiOutlineLoading className="h-6 w-6 animate-spin mr-3" />
            Creating Account...
          </>
        ) : (
          "Create Account"
        )}
      </Button>
      <div className="flex w-75">
        <p>Already have one?</p>
        <Link href="/login" className="ml-2 text-blue-700 hover:underline">
          Login here :&#41;
        </Link>
      </div>
    </>
  );
};

export default CreateAccountForm;
