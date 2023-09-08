// components/GoogleMap.js
import React, { useState, useRef, useEffect } from "react";
import { LoadScript, GoogleMap, Marker } from "@react-google-maps/api";
import PlacesAutocomplete, { geocodeByAddress, getLatLng } from "react-places-autocomplete";
import { googleAPIKey } from "../../constants/apiKeys";
import { BiLocationPlus } from "react-icons/bi";
import Modal from "react-modal";
import { useRecoilState } from "recoil";
import { locationState } from "@/utils/atoms";

Modal.setAppElement(".wrap");
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const libraries = ["places"] as any;

const GoogleMapsComponent = () => {
  const [mapVisible, setMapVisible] = useState(false);
  const [location, setLocation] = useRecoilState(locationState);
  const [selectedLatLng, setSelectedLatLng] = useState({ lat: 37.5642135, lng: 127.0016985 });

  const mapRef = useRef<GoogleMap | null>(null);

  const API_KEY = googleAPIKey;

  useEffect(() => {
    if (mapVisible) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [mapVisible]);

  const handleMapClose = () => {
    setMapVisible(false);
  };

  const handleToggleMap = () => {
    setMapVisible(!mapVisible);
  };

  const handleChange = (address: string) => {
    setLocation(address);
  };

  const handleSelect = (address: string) => {
    geocodeByAddress(address)
      .then((results) => {
        setLocation(results[0].formatted_address);
        return getLatLng(results[0]);
      })
      .then((latLng) => {
        setSelectedLatLng(latLng);
      })
      .catch((error) => {
        alert("There was an error!" + error);
      });
  };

  return (
    <LoadScript googleMapsApiKey={API_KEY} libraries={libraries}>
      <div>
        <div className="flex items-center">
          <button onClick={handleToggleMap} className="badge badge-outline h-7 border-gray-300">
            <BiLocationPlus className="text-lg mt-[1px]" />
            위치 설정
          </button>
          <div className="ml-3">{location}</div>
        </div>
        <Modal
          isOpen={mapVisible}
          onRequestClose={handleToggleMap}
          style={{
            content: {
              width: "600px",
              height: "700px",
              margin: "auto",
            },
          }}
        >
          <GoogleMap
            mapContainerStyle={{
              height: "30%",
              width: "80%",
              margin: "auto",
            }}
            options={{ disableDefaultUI: true }}
            ref={mapRef}
            center={selectedLatLng}
            zoom={15}
          >
            <Marker position={selectedLatLng} />
          </GoogleMap>
          <div className="mx-auto w-[450px] mt-5">
            <PlacesAutocomplete value={location} onChange={handleChange} onSelect={handleSelect}>
              {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
                <div>
                  <input
                    {...getInputProps({ placeholder: "장소를 입력하세요" })}
                    className="py-2 border-b border-gray-300 w-[450px]"
                  />
                  <div className="h-[300px]">
                    {loading ? <div>Loading...</div> : null}
                    {suggestions.map((suggestion) => {
                      const style = suggestion.active
                        ? { backgroundColor: "#42a5f5", cursor: "pointer" }
                        : { backgroundColor: "#ffffff", cursor: "pointer" };

                      const suggestionProps = getSuggestionItemProps(suggestion);

                      return (
                        <div
                          {...suggestionProps}
                          key={suggestion.placeId || suggestion.description}
                          style={style}
                          className="py-2 border-b"
                        >
                          {suggestion.description}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </PlacesAutocomplete>
          </div>
          <div className="flex">
            <button className="btn m-auto w-[450px]" onClick={handleMapClose}>
              확인
            </button>
          </div>
        </Modal>
      </div>
    </LoadScript>
  );
};

export default GoogleMapsComponent;
