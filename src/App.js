require('./App.css');

const React = require('react');

const electron = window.require('electron');
const dialog = electron.remote.dialog;

const XLXS = window.require('xlsx');
const { Helmet } = require('react-helmet');
const { Formik, Form, Field } = require('formik');
const store = require('store');
const storeUpdate = require('store/plugins/update.js');
const isEqual = require('lodash/isEqual');
const isEmpty = require('lodash/isEmpty');
const filter = require('lodash/filter');
const merge = require('lodash/merge');
const trim = require('lodash/trim');
const toString = require('lodash/toString');
const size = require('lodash/size');
const times = require('lodash/times');
const remove = require('lodash/remove');

const XyCenterTranslate = require('./components/XyCenterTranslate');
const Gutter = require('./components/Gutter');
const View = require('./components/View');
const Box = require('./components/Box');
const Text = require('./components/Text');
const ClearfixDiv = require('./components/ClearfixDiv');
const LeftFloatDiv = require('./components/LeftFloatDiv');
const RightFloatDiv = require('./components/RightFloatDiv');
const LineSplitedGutter = require('./components/LineSplitedGutter');

const imgWelcome = require('./welcome.jpg');

const ipt = React.createRef();

store.addPlugin(storeUpdate);

function App() {
  const [loaded, loadIt] = React.useState(
    isEmpty(store.get('db')) ? false : true,
  );

  const [guestInfo, updateGuestInfo] = React.useState({
    userName: null,
    userPhone: null,
    userTable: null,
    userSeat: null,
  });

  React.useEffect(() => {
    if (!isEqual(loaded, false)) {
      ipt.current.focus();
    }
  }, [loaded]);

  return (
    <>
      <Helmet>
        <title>签到</title>
      </Helmet>

      {isEqual(loaded, true) && (
        <View className="view-checking">
          <Gutter h="32px" />
          <Formik
            initialValues={{ guest: '' }}
            onSubmit={({ guest }, actions) => {
              const foundGuest = findOneGuestByPhone({ phone: guest });

              if (isEmpty(foundGuest)) {
                actions.resetForm();

                updateGuestInfo({
                  userName: null,
                  userPhone: null,
                });

                return;
              }

              store.update('db', targetDB => {
                remove(targetDB, val =>
                  isEqual(val.userPhone, findOneGuestByPhone({ phone: guest })),
                );

                targetDB.unshift(
                  merge(foundGuest[0], {
                    checked: foundGuest[0].checked + 1,
                  }),
                );

                return targetDB;
              });

              updateGuestInfo({
                userName: foundGuest[0].userName,
                userPhone: foundGuest[0].userPhone,
              });

              actions.resetForm();
            }}
          >
            {props => (
              <Form>
                <Field name="lastName">
                  {() => {
                    return (
                      <Box>
                        <div className="input-skin">
                          <Box>
                            <input
                              ref={ipt}
                              name="guest"
                              value={props.values.guest}
                              onChange={props.handleChange}
                              onBlur={props.handleBlur}
                              type="text"
                              placeholder="等待扫码"
                            />
                          </Box>
                        </div>
                      </Box>
                    );
                  }}
                </Field>
              </Form>
            )}
          </Formik>

          <Gutter h="130px" />

          <Box>
            <div>
              <Text
                b="bold"
                size="18px"
                align="center"
                color={(() =>
                  isEmpty(guestInfo.userSeat) ? '#dfe6e9' : '#000')()}
              >
                {isEmpty(guestInfo.userSeat) ? '000' : guestInfo.userSeat}
              </Text>
            </div>
          </Box>

          <Box>
            <div>
              <Text b="bold" size="18px" align="center">
                座位编号
              </Text>
            </div>
          </Box>

          <Gutter h="100px" />

          <Box p="0 45px">
            <ClearfixDiv>
              <LeftFloatDiv w="30%">
                <Text size="18px" align="left">
                  餐桌号
                </Text>
              </LeftFloatDiv>
              <RightFloatDiv w="70%">
                <Text b="bold" size="18px" align="right">
                  {guestInfo.userTable}
                </Text>
              </RightFloatDiv>
            </ClearfixDiv>
          </Box>

          <LineSplitedGutter p="0 45px" top="20px" bottom="20px" dot />

          <Box p="0 45px">
            <ClearfixDiv>
              <LeftFloatDiv w="30%">
                <Text size="18px" align="left">
                  姓名
                </Text>
              </LeftFloatDiv>
              <RightFloatDiv w="70%">
                <Text b="bold" size="18px" align="right">
                  {guestInfo.userName}
                </Text>
              </RightFloatDiv>
            </ClearfixDiv>
          </Box>

          <LineSplitedGutter p="0 45px" top="20px" bottom="20px" dot />

          <Box p="0 45px">
            <ClearfixDiv>
              <LeftFloatDiv w="30%">
                <Text size="18px" align="left">
                  电话
                </Text>
              </LeftFloatDiv>
              <RightFloatDiv w="70%">
                <Text b="bold" size="18px" align="right">
                  {guestInfo.userPhone}
                </Text>
              </RightFloatDiv>
            </ClearfixDiv>
          </Box>
        </View>
      )}

      {!isEqual(loaded, true) && (
        <View className="view-import-xlsx">
          <WelcomeImage />
          <ImportTrigger
            onClick={() => {
              const xlsx = readXlsxFile(getXlsxFile());
              if (isEmpty(xlsx)) {
                return;
              }

              const db = times(size(xlsx), idx => ({
                userName: xlsx[idx]['姓名'],
                userPhone: formatPhoneNumber({ phone: xlsx[idx]['手机号'] }),
                checked: 0,
              }));

              store.set('db', db);

              loadIt(true);
            }}
          />
        </View>
      )}
    </>
  );
}

function WelcomeImage() {
  return (
    <div className="welcome-image">
      <img src={imgWelcome} alt="欢迎" />
    </div>
  );
}

function ImportTrigger({ onClick }) {
  return (
    <div className="import-trigger" onClick={onClick}>
      <XyCenterTranslate className="skin">
        <div>
          <i className="icon-import" />
        </div>

        <Gutter h="10px" />

        <div className="name">导入文件</div>
      </XyCenterTranslate>
    </div>
  );
}

function formatPhoneNumber({ phone }) {
  return +trim(toString(phone).replace(/\s/g, ''));
}

function findOneGuestByPhone({ phone }) {
  const db = store.get('db');
  return filter(db, ['userPhone', formatPhoneNumber({ phone })]);
}

function getXlsxFile() {
  const rslt = dialog.showOpenDialogSync({
    properties: ['openFile'],
    filters: [{ name: 'Excel', extensions: ['xlsx', 'xls'] }],
  });

  return rslt ? rslt[0] : null;
}

function readXlsxFile(xlsxFile) {
  if (!xlsxFile) {
    return;
  }

  const workbook = XLXS.readFile(xlsxFile);
  return XLXS.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]]);
}

export default App;
