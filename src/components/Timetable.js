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
		"8:00",
		"8:30",
		"9:00",
		"9:30",
		"10:00",
		"10:30",
		"11:00",
		"11:30",
		"12:00",
		"12:30",
		"13:00",
		"13:30",
		"14:00",
		"14:30",
		"15:00",
		"15:30",
		"16:00",
		"16:30",
		"17:00",
		"17:30",
		"18:00",
	];

	const days = ["Mon", "Tue", "Wed", "Thu", "Fri"];

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
					return {
						day: startDate
							.toLocaleDateString("en-US", { weekday: "short" })
							.slice(0, 3),
						startTime: startDate.toLocaleTimeString("en-US", {
							hour: "2-digit",
							minute: "2-digit",
							hour12: false,
						}),
						endTime: event.endDate.toJSDate().toLocaleTimeString("en-US", {
							hour: "2-digit",
							minute: "2-digit",
							hour12: false,
						}),
						module: event.summary,
						location: event.location || "No location specified",
						type: event.description || "No type specified",
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
		return events.find(
			(event) => event.day === day && event.startTime === time
		);
	};

	return (
		<div className="timetable-container">
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
						<th></th>
						{times.map((time) => (
							<th key={time}>{time}</th>
						))}
					</tr>
				</thead>
				<tbody>
					{days.map((day) => (
						<tr key={day}>
							<td className="day-cell">{day}</td>
							{times.map((time) => {
								const event = getEventForTimeSlot(day, time);
								return (
									<td
										key={`${day}-${time}`}
										className={event ? "event-cell" : ""}
									>
										{event && (
											<div className="event-content">
												<div>{event.module}</div>
												<div className="location">
													Location: {event.location}
												</div>
											</div>
										)}
									</td>
								);
							})}
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
};

export default Timetable;
