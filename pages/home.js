import CoreLayout from "components/coreLayout";
import {
  useAuthUser,
  withAuthUser,
  withAuthUserTokenSSR,
  AuthAction,
} from "next-firebase-auth";

const Home = () => {
  return (
    <div>
      <div className="pl-2 pt-1 pb-2 h-24 flex-none">Testing 1</div>
      <div className="object-none object-right pl-2 pt-1 flex-none h-24 ">
        Testing 2
      </div>
      <div className="pl-2 pt-1 flex-none h-24 ">Testing 3</div>
      <div className="p-2 flex-none absolute bottom-0 right-0">
        Bottom Right
      </div>
    </div>
  );
};

Home.getLayout = function getLayout(page) {
  return <CoreLayout>{page}</CoreLayout>;
};

export const getServerSideProps = withAuthUserTokenSSR({
  whenUnauthed: AuthAction.REDIRECT_TO_LOGIN,
})();

export default withAuthUser()(Home);
