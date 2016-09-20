export default function(identity, isSuper) {
	identity = parseInt(identity);
	if(isSuper === true) {
		switch(identity){
			case 120:
				return "超管";
				break;
			default:
				return "";
		}
	} else {
		switch(identity){
			case 60:
				return "房管";
				break;
			case 90:
				return "主播";
				break;
			default:
				return "";
		}
	}
}
