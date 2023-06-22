interface SquareProps {
    color: string;
    id: number;
}
function Square(props: SquareProps) {
    return (
        <div
            key={props.id}
            className={`aspect-square w-[110px] 
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
