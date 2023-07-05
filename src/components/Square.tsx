interface SquareProps {
    color: string;
    width: number;
    id: number;
}
function Square(props: SquareProps) {
    return (
        <div
            key={props.id}
            className={`aspect-square w-[${props.width}px] 
        ${
            props.color === "mark"
                ? "bg-mark"
                : props.color === "dark"
                ? "bg-dark"
                : "bg-light"
        }`}
            onClick={() => console.log(props.id)}
        ></div>
    );
}

export default Square;
