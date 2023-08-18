function ImageNotif({ illustration, message }) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <img alt={message} src={illustration} width={400} height={400} />
      <h2 style={{ fontFamily: "raleway" }}>{message}</h2>
    </div>
  );
}

export default ImageNotif;
