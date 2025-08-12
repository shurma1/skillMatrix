import {useParams} from "react-router-dom";

const SkillVersionPage = () => {
	
	const { skillId } = useParams<{ skillId: string }>();
	
	return (
		<div>
			{skillId}
		</div>
	)
};

export default SkillVersionPage;
