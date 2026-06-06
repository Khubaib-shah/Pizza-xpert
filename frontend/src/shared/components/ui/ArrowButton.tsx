import React from "react";

const ArrowButton = ({
    icon: Icon,
    onClick,
    title,
    position = "left",
}) => {
    return (
        <button
            onClick={onClick}
            title={title}
            className={`
        group
        absolute top-1/2 -translate-y-1/2
        hidden md:block
        w-14 h-14
        overflow-hidden
        cursor-pointer
        z-30
        bg-transparent
        border-0
        ${position === "left" ? "left-4" : "right-4"}

        before:content-['']
        before:absolute
        before:inset-[7px]
        before:rounded-full
        before:border-[4px]
        before:border-white
        before:transition-all
        before:duration-500

        after:content-['']
        after:absolute
        after:inset-[7px]
        after:rounded-full
        after:border-[4px]
        after:border-tomato
        after:scale-125
        after:opacity-0
        after:transition-all
        after:duration-500

        hover:before:opacity-0
        hover:before:scale-75

        hover:after:opacity-100
        hover:after:scale-100
      `}
        >
            <div
                className="
          absolute top-0 left-0 flex
          transition-transform duration-300
          group-hover:-translate-x-14
        "
            >
                <span className="w-14 h-14 flex items-center justify-center">
                    <Icon className="w-5 h-5 text-white" />
                </span>

                <span className="w-14 h-14 flex items-center justify-center">
                    <Icon className="w-5 h-5 text-tomato" />
                </span>
            </div>
        </button>
    );
};

export default ArrowButton;