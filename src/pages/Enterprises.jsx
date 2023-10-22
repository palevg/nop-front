import { useContext, useState } from 'react';
import { AuthContext } from "../context/authContext";
import EnterprService from '../API/EnterprService';
import { useFetching } from '../hooks/useFetching';
import { EnterprList } from '../components/EnterprList';
import { EnterprEdit } from "../components/EnterprEdit";
import { regionNames, licensesStates, ordersStates } from "../utils/data";
import { Dialog, Box, DialogContent, DialogActions, FormControl, FormLabel, RadioGroup, FormControlLabel, Radio, TextField, MenuItem, Button } from "@mui/material";
import AddBusinessIcon from '@mui/icons-material/AddBusiness';

export default function Enterprises() {
  const { currentUser, enterprList, newEnterprList, searchValues } = useContext(AuthContext);
  const [enterprs, setEnterprs] = useState(enterprList);
  const [editEnterpr, setEditEnterpr] = useState(null);
  const [openDialog, setOpenDialog] = useState(enterprs.length ? false : true);
  const [searchArea, setSearchArea] = useState(searchValues.area);
  const [searchLicense, setSearchLicense] = useState(searchValues.license);
  const [searchOrder, setSearchOrder] = useState(searchValues.order);
  const [searchRegion, setSearchRegion] = useState(searchValues.region);
  const [searchName, setSearchName] = useState(searchValues.name);
  const [searchKod, setSearchKod] = useState(searchValues.edrpou);
  const [searchAddr, setSearchAddr] = useState(searchValues.address);
  const [dataToSearch] = useState(searchValues);

  const newEnterprData = {
    Ident: null, DateCreate: null, KeyName: null, FullName: null, Region: 11, OPForm: 19,
    FormVlasn: 8, VidDijal: 68, StatutSize: null, AddressDeUre: null, AddressDeFacto: null,
    Phones: null, Faxes: null, RosRah: null, RosUst: null, RosMFO: null, AfilEnterp: null,
    Podatok: 2, StateRisk: 3, AddInfo: null, HideInfo: null, Shevron: null
  }

  const onSubmit = () => {
    dataToSearch.area = searchArea;
    dataToSearch.license = searchLicense;
    dataToSearch.order = searchOrder;
    dataToSearch.region = searchRegion;
    dataToSearch.name = searchName;
    dataToSearch.edrpou = searchKod;
    dataToSearch.address = searchAddr;
    setEnterprs([]);
    setOpenDialog(false);
    fetchEnterprs();
  }

  const [fetchEnterprs, isEnterprLoading, enterprError] = useFetching(async () => {
    const response = await EnterprService.getSome(dataToSearch);
    setEnterprs(response.data);
    newEnterprList(dataToSearch, response.data);
  });

  return editEnterpr
    ? <EnterprEdit addNew={true} enterpr={newEnterprData} afil={[]} setEditEnterpr={setEditEnterpr} editor={currentUser.Id} />
    : <div className="list-page">
      <Dialog maxWidth="xs" open={openDialog}>
        <Box sx={{ width: 300 }}>
          <DialogContent>
            <FormControl>
              <FormLabel id="radio-buttons-area">Шукати у розділі</FormLabel>
              <RadioGroup
                sx={{ mb: 2 }}
                row
                aria-labelledby="radio-buttons-area"
                value={searchArea}
                onChange={(event) => { setSearchArea(event.target.value) }}
              >
                <FormControlLabel value="0" control={<Radio />} label="ліцензії" />
                <FormControlLabel value="1" control={<Radio />} label="заяви" />
              </RadioGroup>
            </FormControl>
            {searchArea === "0" && <TextField
              sx={{ mb: 2 }}
              label="Стан ліцензій"
              select
              value={searchLicense}
              onChange={(event) => { setSearchLicense(event.target.value) }}
              size="small"
              fullWidth
            >
              {licensesStates.map((licensesState, index) =>
                <MenuItem key={index} value={index}>{licensesState}</MenuItem>
              )}
            </TextField>}
            {searchArea === "1" && <TextField
              sx={{ mb: 2 }}
              label="Стан заяв"
              select
              value={searchOrder}
              onChange={(event) => { setSearchOrder(event.target.value) }}
              size="small"
              fullWidth
            >
              {ordersStates.map((ordersState, index) =>
                <MenuItem key={index} value={index}>{ordersState}</MenuItem>
              )}
            </TextField>}
            <TextField
              sx={{ mb: 2 }}
              label="Територія пошуку"
              select
              value={searchRegion}
              onChange={(event) => { setSearchRegion(event.target.value) }}
              size="small"
              fullWidth
            >
              {regionNames.map(regionName =>
                <MenuItem key={regionName.Id} value={regionName.Id}>{regionName.NameRegion}</MenuItem>
              )}
            </TextField>
            <TextField
              sx={{ mb: 2 }}
              label="Назва юридичної особи"
              value={searchName}
              onChange={(event) => { setSearchName(event.target.value) }}
              size="small"
              fullWidth
            />
            <TextField
              sx={{ mb: 2 }}
              label="Код за ЄДРПОУ"
              value={searchKod}
              onChange={(event) => { setSearchKod(event.target.value) }}
              size="small"
              fullWidth />
            <TextField
              label="Місцезнаходження"
              value={searchAddr}
              onChange={(event) => { setSearchAddr(event.target.value) }}
              size="small"
              fullWidth />
          </DialogContent>
          <DialogActions>
            <Button sx={{ mb: 2 }} onClick={() => onSubmit()} variant="contained">ПІДТВЕРДИТИ</Button>
            <Button sx={{ mr: 2, mb: 2 }} onClick={() => setOpenDialog(false)} variant="outlined">СКАСУВАТИ</Button>
          </DialogActions>
        </Box>
      </Dialog>
      <div className="buttons-top">
        <div className="buttons-top__search">
          <Button onClick={() => setOpenDialog(true)} variant="outlined">Фільтр</Button>
          <div> ➨ знайдено {enterprs.length}
            {enterprs.length === 1 && ' юридична особа'}
            {enterprs.length > 1 && enterprs.length < 5 && ' юридичні особи'}
            {(enterprs.length === 0 || enterprs.length > 4) && ' юридичних осіб'}
            {': регіон - ' + regionNames[dataToSearch.region].NameRegion}
            {dataToSearch.name && ', назва містить "' + dataToSearch.name + '"'}
            {dataToSearch.edrpou && ', код ЄДРПОУ містить "' + dataToSearch.edrpou + '"'}
            {dataToSearch.address && ', адреса містить "' + dataToSearch.address + '"'}
            {dataToSearch.area === "0" && '; стан ліцензій - ' + licensesStates[dataToSearch.license]}
            {dataToSearch.area === "1" && '; стан заяв - ' + ordersStates[dataToSearch.order]}
          </div>
        </div>
        {currentUser !== null && currentUser.acc > 1 && <div className="buttons-top__new">
          <Button onClick={() => setEditEnterpr(true)} variant="contained" startIcon={<AddBusinessIcon />}>Додати нову юридичну особу</Button>
        </div>}
      </div>
      {enterprError && <h1>Сталась помилка "{enterprError}"</h1>}
      <EnterprList enterprs={enterprs} loading={isEnterprLoading} title="Юридичні особи" titleSize={true} />
    </div>
}