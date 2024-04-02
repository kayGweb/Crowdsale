import Spinner from "react-bootstrap/Spinner";

const Loading = () => {
	return (
		<div className="text-center my-5">
			<Spinner animation="grow">
				<span className="sr-only">Loading...</span>
			</Spinner>
		</div>
	);
};

export default Loading;
