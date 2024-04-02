const Info = ({ account, accountBalance }) => {
	return (
		<div className="my-3">
			<p>
				<strong>Account: {account}</strong>
			</p>
			<p>
				<strong>Tokens Owned: {accountBalance} Tokens</strong>
			</p>
		</div>
	);
};

export default Info;
