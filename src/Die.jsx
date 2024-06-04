/* eslint-disable react/prop-types */
export default function Die(props) {
  return (
    <>
      <div className="die" style={props.style} onClick={props.holdDice}>
        {props.value}
      </div>
    </>
  );
}
