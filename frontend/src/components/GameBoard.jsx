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
                                w-14 h-14
                                border-2
                                rounded
                                flex
                                items-center
                                justify-center
                                text-2xl
                                font-bold
                                ${
                                    colors[rowIndex][columnIndex] === "green"
                                        ? "bg-green-500 text-white border-green-500"
                                        : colors[rowIndex][columnIndex] === "yellow"
                                        ? "bg-yellow-500 text-white border-yellow-500"
                                        : colors[rowIndex][columnIndex] === "gray"
                                        ? "bg-gray-500 text-white border-gray-500"
                                        : "border-gray-400"
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