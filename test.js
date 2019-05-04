import config from "../../config";
import TokenService from "../../services/token-service";
import Dropdown from '../Dropdown/Dropdown';

export default function CreateSquadForm(props) {
  const context = useContext(GameContext);

  //inputs
  const [squadName, setSquadname] = useState("");
  const [squadDescription, setSquadDescription] = useState('');
  const [squadRequirement, setSquadRequirement] = useState('');
  const [squadRequirement2, setSquadRequirement2] = useState('');
  const [squadGamemode, setSquadGamemode] = useState(-1);
  //spots
  const [spotMenuShown, setSpotMenuShown] = useState(undefined);
  const [spotsObj, setSpotsObj] = useState({});

  useEffect(() => {
    let temp = {};
    let blankSpot = {
      filled: null,
      roles: [],
      omitted: false,
      showOptions: false,
    };
    //we don't include the first one as a spot-input since the owner will always be included
    for (let i = 1; i < context.game.squad_limit; i++) {
      temp[i] = blankSpot;
    }
    setSpotObj(temp);
  }, []);


  function onSquadCreate(e) {
    e.preventDefault();
    const spots = [];
    Object.entries(spotsObj).forEach(([_, value]) => {
      !value.omitted && spots.push(value);
    });
    let newSquad = {
      room_id: props.roomUrl,
      squad: {
        game_id: context.game.id,
        title: squadName,
        description: squadDescription,
        gamemode: parseInt(squadGamemode),
        require_app: false,
      },
      spots,
      requirement: [squadRequirement, squadRequirement2],
    };

    fetch(
        `${config.API_ENDPOINT}/parties`, 
        {
          method: 'POST',
          headers: {
            authorization: `Bearer ${TokenService.getAuthToken()}`,
            'content-type': 'application/json'
          },
          body: JSON.stringify(newSquad),
        }
      )
      .then(res =>
        (!res.ok)
          ? res.json().then(e => Promise.reject(e))
          : res.json()
      )
      .then((respJson) => {
        console.log(respJson)
        // props.history.push(`/squad/${respJson.id}`);
      })
      .catch(err => {
        //UPDATE TO DISPLAY ERROR
        console.error(err);
      });
  }

  //SPOT HANDLERS
  function toggleSpotOptionsMenu(index) {
    (spotMenuShown === index)
      ? setSpotMenuShown(undefined)
      : setSpotMenuShown(index);
  }

  function toggleOmitSpot(index) {
    let newSpotsObj = {...spotsObj};
    newSpotsObj[index] = {
      ...newSpotsObj[index], 
      omitted: !newSpotsObj[index].omitted, 
      roles: [] 
    };
    setSpotsObj(newSpotsObj);
  }

  function handleSpotSubmit(index, roles) {
    let newSpotsObj = {...spotsObj};
    let newObj = {...newSpotsObj[index]};

    newSpotsObj[index].omitted = false;
    newSpotsObj[index].roles = roles;

    setSpotsObj(newSpotsObj);
  }

  function generateSpotInputs() {
    let temp = [];
    let tempOmitted = [];
    Object.entries(spotsObj).forEach(([key, value]) => {
      let tempSpot = (
        <SpotInput
          key={key}
          index={key}
          omitted={value.omitted}
          toggleOmitSpot={toggleOmitSpot}
          toggleSpotOptionsMenu={toggleSpotOptionsMenu}
          showOptions={key === spotMenuShown}
          roles={value.roles}
          handleSpotSubmit={handleSpotSubmit}
        />
      );
      (value.omitted)
        ? tempOmitted.push(tempSpot)
        : temp.push(tempSpot);
    });

    return temp.concat(tempOmitted);
  }

  return (
    <main>
      <div className="createSquadForm">
        <h2>Create Squad</h2>

        <form className="create-squad-form" onSubmit={onSquadCreate}>
          <div className="input-field">
            <label>Squad Name
              <input
                type="text"
                placeholder="squad"
                value={squadName}
                required
                onChange={e => setSquadname(e.target.value)}
              />
            </label>

            <label>Description
              <textarea
                id="squad-description-input"
                type="text"
                maxLength='140'
                placeholder="limit 140 chars"
                value={squadDescription}
                onChange={e => setSquadDescription(e.target.value)}
              />
            </label>

            <Dropdown
              label='Squad Requirements'
              onChange={e => {
                let { value }= e.target;
                if (value === '' && squadRequirement2) {
                  setSquadRequirement2('');
                }
                setSquadRequirement(value)}
              }
              startValue={squadRequirement}
              options={[['', { name: 'None' }], ...Object.entries(context.game.requirements)]}
            />

            {squadRequirement &&
              <Dropdown
                label='Squad Requirements'
                onChange={e => setSquadRequirement2(e.target.value)}
                startValue={squadRequirement2}
                options={getSquadRequirement2Options()}
              />
            }

            <label htmlFor="squad-gamemodes-input">Squad Gamemodes</label>
            <Dropdown 
              id="squad-gamemode-dropdown"
              onChange={e => setSquadGamemode(e.target.value)}
              startValue={squadGamemode}
              options={[[-1, { name: 'All', icon_url: '' }], ...Object.entries(context.game.gamemodes)]}
            />

          </div>

          <button
            type="submit"
            className="create-squad-button"
          >
            Create Squad
          </button>
        </form>

        <div className='spot-container'>
          <div className="spot_input">Owner Spot</div>
          {mapSpots()}
        </div>

      </div>
    </main>
  );
}