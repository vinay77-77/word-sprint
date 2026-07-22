export default function GameBoard({ board, colors }) {
    return (
        <div className="flex flex-col gap-2">

            {board.map((row, rowIndex) => (

                <div
                    key={rowIndex}
                    className="flex gap-2 justify-center"
                >

                    {row.map((letter, columnIndex) => (

                        <div
                            key={columnIndex}
                            className={`
                                w-16
                                h-16
                                rounded-lg
                                border-2
                                flex
                                items-center
                                justify-center
                                text-2xl
                                font-bold
                                transition-all
                                duration-200
                                hover:scale-105
                                ${
                                    colors[rowIndex][columnIndex] === "green"
                                        ? "bg-green-500 text-white border-green-500"
                                        : colors[rowIndex][columnIndex] === "yellow"
                                        ? "bg-yellow-500 text-white border-yellow-500"
                                        : colors[rowIndex][columnIndex] === "gray"
                                        ? "bg-gray-500 text-white border-gray-500"
                                        : "bg-white border-gray-300"
                                }
                            `}
                        >
                            {letter}
                        </div>

                    ))}

                </div>

            ))}

        </div>
    );
}