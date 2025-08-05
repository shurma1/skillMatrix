import User from './entities/User';
import Permission from './entities/Permission';
import UserToPermission from './entities/UserToPermission';
import Image from './entities/Image';
import JobRole from './entities/JobRole';
import UserToJobRole from './entities/UserToJobRole';
import JobRoleToSkills from './entities/JobRoleToSkills';
import Skill from './entities/Skill';
import UserToSkills from './entities/UserToSkills';
import UserToConfirmSkills from './entities/UserToConfirmSkills';
import UserSkillView from './entities/UserSkillView';
import Tag from './entities/Tag';
import TagToSkill from './entities/TagToSkill';
import SkillVersion from './entities/SkillVersion';
import File from './entities/File';
import FileToSkillVersion from './entities/FileToSkillVersion';
import Test from './entities/Test';
import UserTest from './entities/UserTest';
import UserTestResult from './entities/UserTestResult';
import Question from './entities/Question';
import AnswerVariant from './entities/AnswerVariant';

// User <-> Permission (many-to-many)
User.belongsToMany(Permission, { through: UserToPermission, foreignKey: 'userId' });
Permission.belongsToMany(User, { through: UserToPermission, foreignKey: 'permissionId' });

// User <-> Image (one-to-one)
User.belongsTo(Image, { foreignKey: 'avatar_id', as: 'avatar' });
Image.hasOne(User, { foreignKey: 'avatar_id', as: 'user' });

// User <-> JobRole (many-to-many)
User.belongsToMany(JobRole, { through: UserToJobRole, foreignKey: 'userId' });
JobRole.belongsToMany(User, { through: UserToJobRole, foreignKey: 'jobRoleId' });

// JobRole <-> Skill (many-to-many)
JobRole.belongsToMany(Skill, { through: JobRoleToSkills, foreignKey: 'jobRoleId' });
Skill.belongsToMany(JobRole, { through: JobRoleToSkills, foreignKey: 'skillId' });

// User <-> Skill (many-to-many)
User.belongsToMany(Skill, { through: UserToSkills, foreignKey: 'userId' });
Skill.belongsToMany(User, { through: UserToSkills, foreignKey: 'skillId' });

// UserToConfirmSkills: User <-> Skill (many-to-many with extra fields)
User.hasMany(UserToConfirmSkills, { foreignKey: 'userId' });
Skill.hasMany(UserToConfirmSkills, { foreignKey: 'skillId' });
UserToConfirmSkills.belongsTo(User, { foreignKey: 'userId' });
UserToConfirmSkills.belongsTo(Skill, { foreignKey: 'skillId' });

// UserSkillView: User <-> Skill (many-to-many with extra fields)
User.hasMany(UserSkillView, { foreignKey: 'userId' });
Skill.hasMany(UserSkillView, { foreignKey: 'skillId' });
UserSkillView.belongsTo(User, { foreignKey: 'userId' });
UserSkillView.belongsTo(Skill, { foreignKey: 'skillId' });

// Tag <-> Skill (many-to-many)
Tag.belongsToMany(Skill, { through: TagToSkill, foreignKey: 'tagId' });
Skill.belongsToMany(Tag, { through: TagToSkill, foreignKey: 'skillId' });

// Skill <-> SkillVersion (one-to-many)
Skill.hasMany(SkillVersion, { foreignKey: 'skillId' });
SkillVersion.belongsTo(Skill, { foreignKey: 'skillId' });

// File <-> SkillVersion (many-to-many)
File.belongsToMany(SkillVersion, { through: FileToSkillVersion, foreignKey: 'fileId' });
SkillVersion.belongsToMany(File, { through: FileToSkillVersion, foreignKey: 'skillVersionId' });

// Test <-> SkillVersion (many-to-one)
SkillVersion.hasMany(Test, { foreignKey: 'skillVersionId' });
Test.belongsTo(SkillVersion, { foreignKey: 'skillVersionId' });

// User <-> Test (many-to-many)
User.belongsToMany(Test, { through: UserTest, foreignKey: 'userId' });
Test.belongsToMany(User, { through: UserTest, foreignKey: 'testId' });

// UserTestResult: UserTest <-> Question (many-to-many with extra fields)
UserTest.hasMany(UserTestResult, { foreignKey: 'userTestId' });
UserTestResult.belongsTo(UserTest, { foreignKey: 'userTestId' });
Question.hasMany(UserTestResult, { foreignKey: 'questionId' });
UserTestResult.belongsTo(Question, { foreignKey: 'questionId' });

// Question <-> Test (many-to-one)
Test.hasMany(Question, { foreignKey: 'testId' });
Question.belongsTo(Test, { foreignKey: 'testId' });

// AnswerVariant <-> Question (many-to-one)
Question.hasMany(AnswerVariant, { foreignKey: 'questionId' });
AnswerVariant.belongsTo(Question, { foreignKey: 'questionId' });

export {
	User,
	Permission,
	UserToPermission,
	Image,
	JobRole,
	UserToJobRole,
	JobRoleToSkills,
	Skill,
	UserToSkills,
	UserToConfirmSkills,
	UserSkillView,
	Tag,
	TagToSkill,
	SkillVersion,
	File,
	FileToSkillVersion,
	Test,
	UserTest,
	UserTestResult,
	Question,
	AnswerVariant,
};
