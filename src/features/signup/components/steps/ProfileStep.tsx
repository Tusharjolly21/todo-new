"use client";

import { useRef, useState, type ChangeEvent, type FormEvent } from "react";
import { Avatar, Button, TextField } from "@/components/ui";
import { fullNameSchema, validateField } from "@/lib/validations/auth.schema";
import { useSignup } from "../../state/signup.context";
import { OnboardingScene } from "../OnboardingScene";
import { ProfileIllustration } from "../previews/illustrations";

const MAX_PHOTO_BYTES = 5 * 1024 * 1024; // 5 MB

export function ProfileStep() {
  const { state, dispatch } = useSignup();
  const [error, setError] = useState<string | null>(null);
  const [photoError, setPhotoError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { fullName, photoDataUrl } = state.data;

  function handlePhotoChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setPhotoError("Please choose an image file.");
      return;
    }
    if (file.size > MAX_PHOTO_BYTES) {
      setPhotoError("Image must be under 5 MB.");
      return;
    }
    setPhotoError(null);
    const reader = new FileReader();
    reader.onload = () =>
      dispatch({ type: "SET_PHOTO", photoDataUrl: reader.result as string });
    reader.readAsDataURL(file);
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const message = validateField(fullNameSchema, fullName);
    if (message) {
      setError(message);
      return;
    }
    dispatch({ type: "NEXT" });
  }

  return (
    <OnboardingScene
      stepLabel="Step 1 of 4"
      preview={<ProfileIllustration className="mx-auto w-full max-w-[420px]" />}
    >
      <h1 className="text-4xl font-extrabold leading-tight tracking-tight text-[#202020]">
        Create your profile
      </h1>
      <p className="mt-4 text-base text-neutral-500">
        Add your name and a photo so your teammates recognize you.
      </p>

      <div className="mt-8 flex items-center gap-4">
        <Avatar name={fullName} src={photoDataUrl} size={72} />
        <div className="flex flex-col items-start gap-1">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="rounded-md border border-neutral-300 px-3 py-1.5 text-sm font-semibold text-[#202020] transition hover:bg-neutral-50"
          >
            Upload photo
          </button>
          {photoDataUrl && (
            <button
              type="button"
              onClick={() =>
                dispatch({ type: "SET_PHOTO", photoDataUrl: null })
              }
              className="text-xs font-medium text-neutral-400 hover:text-neutral-600"
            >
              Remove
            </button>
          )}
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handlePhotoChange}
        />
      </div>
      {photoError && (
        <p role="alert" className="mt-2 text-xs text-brand">
          {photoError}
        </p>
      )}

      <form className="mt-6 space-y-4" onSubmit={handleSubmit} noValidate>
        <TextField
          label="Your name"
          autoFocus
          autoComplete="name"
          placeholder="e.g., Jane Doe"
          value={fullName}
          error={error}
          onChange={(e) => {
            dispatch({ type: "SET_FULL_NAME", fullName: e.target.value });
            if (error) setError(null);
          }}
        />
        <Button type="submit" fullWidth size="lg" className="py-3.5">
          Continue
        </Button>
      </form>
    </OnboardingScene>
  );
}
