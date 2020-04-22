require('./App.css');
const imgWelcome = require('./welcome.jpg');

const electron = window.require('electron');
const XLXS = window.require('xlsx');

const React = require('react');
const { Helmet } = require('react-helmet');
const { Formik, Form, Field } = require('formik');
const store = require('store');
const isEqual = require('lodash/isEqual');
const isEmpty = require('lodash/isEmpty');
const isNumber = require('lodash/isNumber');
const filter = require('lodash/filter');
const remove = require('lodash/remove');
const merge = require('lodash/merge');
const trim = require('lodash/trim');
const toString = require('lodash/toString');
const size = require('lodash/size');
const times = require('lodash/times');

const XyCenterTranslate = require('./components/XyCenterTranslate');
const Gutter = require('./components/Gutter');
const View = require('./components/View');
const Box = require('./components/Box');
const Text = require('./components/Text');
const ClearfixDiv = require('./components/ClearfixDiv');
const LeftFloatDiv = require('./components/LeftFloatDiv');
const RightFloatDiv = require('./components/RightFloatDiv');
const LineSplitedGutter = require('./components/LineSplitedGutter');

const { Menu, MenuItem, dialog, getCurrentWindow, app } = electron.remote;
const ipt = React.createRef();

const storeUpdate = require('store/plugins/update.js');
store.addPlugin(storeUpdate);

function App() {
  const [loadStatus, loaded] = React.useState(
    isEmpty(store.get('db')) ? false : true,
  );

  const [guestInfo, updateGuestInfo] = React.useState({
    userName: null,
    userPhone: null,
    userTable: null,
    userSeat: null,
  });

  React.useEffect(() => {
    if (!isEqual(loadStatus, false)) {
      ipt.current.focus();
    }
  }, [loadStatus]);

  const menu = new Menu();

  menu.append(
    new MenuItem({
      label: '导出数据',
      click() {
        console.log('点击了 "导出数据"');
      },
    }),
  );

  menu.append(
    new MenuItem({
      label: '重新导入数据',
      click() {
        console.log('点击了 "重新导入数据"');
      },
    }),
  );

  menu.append(
    new MenuItem({
      label: '退出',
      click() {
        app.quit();
      },
    }),
  );

  window.addEventListener(
    'contextmenu',
    e => {
      e.preventDefault();
      menu.popup({ window: getCurrentWindow() });
    },
    false,
  );

  return (
    <>
      <Helmet>
        <title>签到</title>
      </Helmet>

      {isEqual(loadStatus, true) && (
        <View className="view-checking">
          <Gutter h="32px" />
          <Formik
            initialValues={{ guest: '' }}
            onSubmit={({ guest }, actions) => {
              const foundGuest = findOneGuestByPhone({ phone: guest });
              actions.resetForm();

              if (isEmpty(foundGuest)) {
                updateGuestInfo({
                  userName: null,
                  userPhone: null,
                  userSeat: null,
                  userTable: null,
                });

                return;
              }

              store.update('db', targetDB => {
                remove(targetDB, val =>
                  isEqual(val.userPhone, formatPhoneNumber({ phone: guest })),
                );

                targetDB.unshift(
                  merge(foundGuest[0], {
                    userChecked: foundGuest[0].userChecked + 1,
                  }),
                );

                return targetDB;
              });

              updateGuestInfo({
                userName: foundGuest[0].userName,
                userPhone: foundGuest[0].userPhone,
                userSeat: foundGuest[0].userSeat,
                userTable: foundGuest[0].userTable,
              });
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
                size="30px"
                align="center"
                color={(() =>
                  isEmpty(guestInfo.userSeat) ? '#dfe6e9' : '#000')()}
              >
                {isEmpty(guestInfo.userSeat) ? '***' : guestInfo.userSeat}
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
                <Text
                  b="bold"
                  align="right"
                  color={(() =>
                    isEmpty(guestInfo.userSeat) ? '#dfe6e9' : '#000')()}
                >
                  {isEmpty(guestInfo.userTable) ? '***' : guestInfo.userTable}
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
                <Text
                  b="bold"
                  size="18px"
                  align="right"
                  color={(() =>
                    isEmpty(guestInfo.userName) ? '#dfe6e9' : '#000')()}
                >
                  {isEmpty(guestInfo.userName) ? '***' : guestInfo.userName}
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
                <Text
                  b="bold"
                  size="18px"
                  align="right"
                  color={(() =>
                    isNumber(guestInfo.userPhone) ? '#000' : '#dfe6e9')()}
                >
                  {isNumber(guestInfo.userPhone) ? guestInfo.userPhone : '***'}
                </Text>
              </RightFloatDiv>
            </ClearfixDiv>
          </Box>
        </View>
      )}

      {!isEqual(loadStatus, true) && (
        <View className="view-import-xlsx">
          <WelcomeImage />
          <ImportTrigger
            onClick={() => {
              const xlsx = readXlsxFile(getXlsxFile());
              if (isEmpty(xlsx)) {
                return;
              }

              const db = times(size(xlsx), idx => ({
                userName: xlsx[idx]['姓名'] || '',
                userPhone:
                  formatPhoneNumber({ phone: xlsx[idx]['电话'] }) || '',
                userSeat: xlsx[idx]['座位号'] || '',
                userTable: xlsx[idx]['餐桌号'] || '',
                userChecked: xlsx[idx]['签到状态'] || 0,
              }));

              store.set('db', db);

              loaded(true);
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
