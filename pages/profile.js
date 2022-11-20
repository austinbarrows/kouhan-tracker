import CoreLayout from "components/coreLayout";
import {
  useAuthUser,
  withAuthUser,
  withAuthUserTokenSSR,
  AuthAction,
} from "next-firebase-auth";

const Profile = () => {
  return <div>Test profile text</div>;
};

Profile.getLayout = function getLayout(page) {
  return <CoreLayout>{page}</CoreLayout>;
};

export const getServerSideProps = withAuthUserTokenSSR({
  whenUnauthed: AuthAction.REDIRECT_TO_LOGIN,
})();

export default withAuthUser()(Profile);
