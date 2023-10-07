import React, { ReactNode } from "react";

interface TabsProps {
  children: ReactNode;
}
interface TabsListProps {
  children: ReactNode;
}
interface TabsTriggerProps {
  value: string;
  children: ReactNode;
  onClick: () => void;
  activeTab: string;
}
interface TabsContentProps {
  value: string;
  children: ReactNode;
}

export const Tabs = (props: TabsProps) => {
  return <div className="flex flex-col w-full">{props.children}</div>;
};

export const TabsList = (props: TabsListProps) => {
  return (
    <div className="flex gap-1 items-center rounded-md border border-gray-400 p-1">
      {props.children}
    </div>
  );
};

export const TabsTrigger = (props: TabsTriggerProps) => {
  return (
    <div
      className={`flex flex-1 justify-center ${
        props.activeTab === props.value
          ? "bg-slate-800 text-white"
          : "text-black"
      } rounded-md p-2`}
      id={props.value}
      onClick={props.onClick}
    >
      {props.children}
    </div>
  );
};

export const TabsContent = (props: TabsContentProps) => {
  return <div>{props.children}</div>;
};
