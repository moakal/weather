import React, { useState, useEffect } from "react";
import ICAL from "ical.js";
import "./Timetable.css";

const Timetable = () => {
	// Initialize state with data from localStorage if it exists
	const [events, setEvents] = useState(() => {
		const savedEvents = localStorage.getItem("timetableEvents");
		return savedEvents ? JSON.parse(savedEvents) : [];
	});

	// Only save to localStorage when events change (not on initial mount)
	useEffect(() => {
		if (events.length > 0) {
			localStorage.setItem("timetableEvents", JSON.stringify(events));
		}
	}, [events]);

	const times = [
		"08:00 - 09:00",
		"09:00 - 10:00",
		"10:00 - 11:00",
		"11:00 - 12:00",
		"12:00 - 13:00",
		"13:00 - 14:00",
		"14:00 - 15:00",
		"15:00 - 16:00",
		"16:00 - 17:00",
		"17:00 - 18:00",
		"18:00 - 19:00",
		"19:00 - 20:00",
		"20:00 - 21:00",
		"21:00 - 22:00",
		"22:00 - 23:00",
		"23:00 - 00:00",
	];

	const days = ["MON", "TUE", "WED", "THU", "FRI"];

	// Available colors for events
	const eventColors = [
		"light-blue",
		"orange",
		"yellow",
		"purple",
		"pink",
		"green",
	];

	// Get consistent color based on module name
	const getEventStyle = (module) => {
		if (!module) return "";

		// Use sum of character codes to create consistent color
		let sum = 0;
		for (let i = 0; i < module.length; i++) {
			sum += module.charCodeAt(i);
		}
		return eventColors[sum % eventColors.length];
	};

	const handleFileUpload = (event) => {
		const file = event.target.files[0];
		if (!file) return;

		const reader = new FileReader();
		reader.onload = (e) => {
			try {
				const jcalData = ICAL.parse(e.target.result);
				const comp = new ICAL.Component(jcalData);
				const vevents = comp.getAllSubcomponents("vevent");

				const parsedEvents = vevents.map((vevent) => {
					const event = new ICAL.Event(vevent);
					const startDate = event.startDate.toJSDate();
					const hours = startDate.getHours();
					// Format hour with leading zero if needed
					const formattedHour = hours < 10 ? `0${hours}` : `${hours}`;

					const endDate = event.endDate.toJSDate();
					const endHours = endDate.getHours();
					const formattedEndHour =
						endHours < 10 ? `0${endHours}` : `${endHours}`;

					return {
						day: startDate
							.toLocaleDateString("en-US", { weekday: "short" })
							.slice(0, 3)
							.toUpperCase(),
						startTime: `${formattedHour}:00`,
						endTime: `${formattedEndHour}:00`,
						module: event.summary,
						location: event.location || "",
						type: event.description || "",
					};
				});

				setEvents(parsedEvents);
				localStorage.setItem("timetableEvents", JSON.stringify(parsedEvents));
			} catch (error) {
				console.error("Error parsing ICS file:", error);
				alert(
					"Error parsing ICS file. Please make sure it's a valid ICS file."
				);
			}
		};
		reader.readAsText(file);
	};

	const clearTimetable = () => {
		if (window.confirm("Are you sure you want to clear the timetable?")) {
			setEvents([]);
			localStorage.removeItem("timetableEvents");
		}
	};

	const getEventForTimeSlot = (day, time) => {
		const [startHour] = time.split(" - ");
		return events.find(
			(event) => event.day === day && event.startTime === startHour
		);
	};

	const renderTimeSlot = (timeSlot) => {
		return (
			<tr key={timeSlot}>
				<td className="time-cell">{timeSlot}</td>
				{days.map((day) => {
					const event = getEventForTimeSlot(day, timeSlot);
					return (
						<td key={`${day}-${timeSlot}`} className="empty-cell">
							{event && (
								<div className={`event-content ${getEventStyle(event.module)}`}>
									<div>{event.module}</div>
									{event.location && (
										<div className="location">{event.location}</div>
									)}
								</div>
							)}
						</td>
					);
				})}
			</tr>
		);
	};

	return (
		<div className="timetable-container">
			<h1 className="timetable-header">Weekly Schedule</h1>
			<div className="import-button-container">
				<input
					type="file"
					accept=".ics"
					onChange={handleFileUpload}
					id="ics-upload"
					className="file-input"
				/>
				<label htmlFor="ics-upload" className="import-button">
					Import Timetable (ICS)
				</label>
				{events.length > 0 && (
					<button onClick={clearTimetable} className="clear-button">
						Clear Timetable
					</button>
				)}
			</div>
			<table className="timetable">
				<thead>
					<tr>
						<th className="time-cell"></th>
						{days.map((day) => (
							<th key={day} className="day-cell">
								{day}
							</th>
						))}
					</tr>
				</thead>
				<tbody>{times.map(renderTimeSlot)}</tbody>
			</table>
		</div>
	);
};

export default Timetable;
