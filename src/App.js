require('./App.css');

const React = require('react');

const electron = window.require('electron');
const dialog = electron.remote.dialog;

const XLXS = window.require('xlsx');

const XyCenterTranslate = require('./components/XyCenterTranslate');
const Gutter = require('./components/Gutter');
const View = require('./components/View');

function App() {
  return (
    <View className="view-import-xlsx">
      <WelcomeImage />
      <ImportTrigger onClick={() => {
        readXlsxFile(getXlsxFile());
      }}/>
    </View>
  );
}

function WelcomeImage() {
  return (
    <div className="welcome-image">
      <img src="https://picsum.photos/id/237/368" alt="欢迎" />
    </div>
  );
}

function ImportTrigger({ onClick }) {
  return (
    <div
      className="import-trigger"
      onClick={onClick}
    >
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

function getXlsxFile() {
  const rslt = dialog.showOpenDialogSync({ properties: ['openFile'] });
  return rslt ? rslt[0] : null;
}

function readXlsxFile(xlsxFile) {
  if (!xlsxFile) {
    return;
  }

  const workbook = XLXS.readFile(xlsxFile);
  console.log(
    XLXS.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]]),
  );
}

export default App;
