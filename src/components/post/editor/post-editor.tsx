"use client";

import Placeholder from "@tiptap/extension-placeholder";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useRef } from "react";
import { CircleX, FileImage, LoaderPinwheel } from "lucide-react";
import Image from "next/image";
import { useDropzone } from "@uploadthing/react";

import "./styles.css";
import { useSession } from "@/lib/session-provider";
import { UserAvatar } from "@/components/user-avatar";
import { useSubmitPostMutation } from "./create-mutations";
import { LoadingButton } from "@/components/loading-button";
import useMediaUpload, { Attachments } from "./use-media-upload";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function PostEditor() {
  const { user } = useSession();

  const mutation = useSubmitPostMutation();
  const {
    startUpload,
    attachments,
    isUploading,
    removeAttachment,
    reset: resetMediaUploads,
    uploadProgress,
  } = useMediaUpload();

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: startUpload,
  });

  const { onClick, ...rootProps } = getRootProps();

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bold: false,
        italic: false,
      }),
      Placeholder.configure({
        placeholder: "Write something nice or bad... ",
      }),
    ],
  });

  const input =
    editor?.getText({
      blockSeparator: "\n",
    }) || "";

  function onSubmit() {
    mutation.mutate(
      {
        content: input,
        mediaIds: attachments.map((a) => a.mediaId).filter(Boolean) as string[],
      },
      {
        onSuccess: () => {
          editor?.commands.clearContent();
          resetMediaUploads();
        },
      },
    );
  }

  return (
    <div className="flex w-full flex-col gap-5 rounded-2xl bg-zinc-100 p-5 shadow-sm">
      <div className="flex gap-5">
        <UserAvatar avatarUrl={user.avatarUrl} className="hidden sm:inline" />
        <div {...rootProps} className="w-full">
          <EditorContent
            editor={editor}
            className={cn(
              "max-h-[20rem] w-full overflow-y-auto rounded-2xl bg-background px-5 py-3",
              isDragActive && "outline-dashed",
            )}
          />
          <input {...getInputProps()} />
        </div>
      </div>
      {!!attachments.length && (
        <AttachmentsPreview
          attachments={attachments}
          removeAttachment={removeAttachment}
        />
      )}
      <div className="flex items-center justify-end gap-3">
        {isUploading ? (
          <>
            <span className="text-sm">{uploadProgress ?? 0} %</span>
            <LoaderPinwheel className="size-5 animate-spin text-primary" />
          </>
        ) : null}
        <AddAttachmentsButton
          onFileSelected={startUpload}
          disabled={isUploading || attachments.length >= 5}
        />
        <LoadingButton
          loading={mutation.isPending}
          onClick={onSubmit}
          disabled={!input.trim() || isUploading}
          className="min-w-20"
        >
          Post
        </LoadingButton>
      </div>
    </div>
  );
}

interface AddAttachmentsProps {
  onFileSelected: (file: File[]) => void;
  disabled: boolean;
}

function AddAttachmentsButton({
  onFileSelected,
  disabled,
}: AddAttachmentsProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        className="text-primary hover:text-primary"
        disabled={disabled}
        onClick={() => fileInputRef.current?.click()}
      >
        <FileImage size={20} />
      </Button>
      <input
        type="file"
        accept="image/*, video/*"
        multiple
        ref={fileInputRef}
        hidden
        onChange={(e) => {
          const files = Array.from(e.target.files || []);
          if (files.length) {
            onFileSelected(files);
            e.target.value = "";
          }
        }}
      />
    </>
  );
}

interface AttachmentsPreviewProps {
  attachments: Attachments[];
  removeAttachment: (fileName: string) => void;
}

function AttachmentsPreview({
  attachments,
  removeAttachment,
}: AttachmentsPreviewProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-3",
        attachments.length > 1 && "sm:grid sm:grid-cols-2",
      )}
    >
      {attachments.map((attach) => (
        <AttachmentPreview
          key={attach.file.name}
          previewAttachments={attach}
          onRemoveClick={() => removeAttachment(attach.file.name)}
        />
      ))}
    </div>
  );
}

interface AttachmentPreviewProps {
  previewAttachments: Attachments;
  onRemoveClick: () => void;
}

function AttachmentPreview({
  previewAttachments: { file, mediaId, isUploading },
  onRemoveClick,
}: AttachmentPreviewProps) {
  const src = URL.createObjectURL(file);

  return (
    <div
      className={cn("relative mx-auto size-fit", isUploading && "opacity-50")}
    >
      {file.type.startsWith("image") ? (
        <Image
          src={src}
          alt="attachment preview"
          width={500}
          height={500}
          className="size-fit max-h-[30rem] rounded-2xl"
        />
      ) : (
        <video controls className="size-fit max-h-[30rem] rounded-2xl">
          <source src={src} type={file.type} />
        </video>
      )}
      {!isUploading && (
        <button
          onClick={onRemoveClick}
          className="absolute right-3 top-3 rounded-full bg-foreground p-1.5 text-background transition-colors hover:bg-background/60"
        >
          <CircleX />
        </button>
      )}
    </div>
  );
}
